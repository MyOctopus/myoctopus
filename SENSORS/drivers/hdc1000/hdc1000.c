/*
 * hdc1000.c
 *
 * Copyright (c) 2015 Matija Podravec <matija_podravec@fastmail.fm>
 *
 * This file is subject to the terms and conditions of version 2 of
 * the GNU General Public License.  See the file COPYING in the main
 * directory of this archive for more details.
 *
 * Driver for the Texas Instruments HDC1000 Low Power, High Accuracy 
 * Digital Humidity Sensor with Temperature Sensor
 *
 */

#include <linux/i2c.h>
#include <linux/mutex.h>
#include <linux/err.h>
#include <linux/delay.h>
#include <linux/module.h>
#include <linux/pm.h>
#include <linux/bitops.h>

#include <linux/iio/iio.h>
#include <linux/iio/sysfs.h>
#include <linux/iio/events.h>


#define HDC1000_DEVICE_ID_REG                 (0xFF)  /*Device ID Register */
#define HDC1000_MANUFACTURER_ID_REG           (0xFE)  /*Manufacturer ID Register */
#define HDC1000_CONFIG_REG                    (0x02)  /*Configuration Register */
#define HDC1000_HUMIDITY_REG                  (0x01)  /*Humidity Register */
#define HDC1000_TEMPERATURE_REG               (0x00)  /*Temperature Reg */

struct hdc1000_chip {
	struct mutex lock;
	struct i2c_client *client;

	/* Remember state for suspend and resume functions */
	bool suspended;
};

static const struct iio_chan_spec hdc1000_channels[] = {
	{
		.type = IIO_TEMP,
		.info_mask_separate = BIT(IIO_CHAN_INFO_RAW) | BIT(IIO_CHAN_INFO_PROCESSED),
	}, {
    .type = IIO_VOLTAGE,
    .info_mask_separate = BIT(IIO_CHAN_INFO_RAW) | BIT(IIO_CHAN_INFO_PROCESSED),
  }
};

static int hdc1000_set_power(struct hdc1000_chip *chip, int on)
{
  return 0;
}

static int hdc1000_get_measurements(struct hdc1000_chip *chip, char *buf) 
{
  struct i2c_client *client = chip->client;
	int ret = -EINVAL;

  ret = i2c_master_send(client, buf, 1);
  if (ret < 0) {
    return ret;
  }
  msleep(14);
  ret = i2c_master_recv(client, buf, 4);
  return ret;
}

static int hdc1000_read_raw(struct iio_dev *indio_dev,
			    struct iio_chan_spec const *channel, int *val,
			    int *val2, long mask)
{
	int ret = -EINVAL;
	struct hdc1000_chip *chip = iio_priv(indio_dev);
  char buf[4] = {0, 0, 0, 0};

	mutex_lock(&chip->lock);
  ret = hdc1000_get_measurements(chip, buf);
  if (ret < 0)
    goto error_ret;
  switch(mask) {
    case IIO_CHAN_INFO_RAW:
      switch(channel->type) {
        case IIO_TEMP:
          *val = ((buf[0] << 8) | buf[1]) & 0x7FFF;
          ret = IIO_VAL_INT;
          break;
        case IIO_VOLTAGE:
          *val = ((buf[2] << 8) | buf[3]) & 0x7FFF;
          ret = IIO_VAL_INT;
          break;
        default:
          break;
      }
      break;
    case IIO_CHAN_INFO_PROCESSED:
      switch(channel->type) {
        case IIO_TEMP:
          *val = (((((buf[0] << 8) | buf[1]) & 0x7FFF) * 165) >> 16) - 40;
          ret = IIO_VAL_INT;
          break;
        case IIO_VOLTAGE:
          *val = ((((buf[2] << 8) | buf[3]) & 0x7FFF) * 100) >> 16;
          ret = IIO_VAL_INT;
          break;
        default:
          break;
      }  
    default:
      break;
  }

error_ret:
	mutex_unlock(&chip->lock);
	return ret;
}

static int hdc1000_write_raw(struct iio_dev *indio_dev,
			    struct iio_chan_spec const *chan,
			    int val,
			    int val2,
			    long mask)
{
  return 0;
}

static int hdc1000_configure(struct hdc1000_chip *chip)
{
	struct i2c_client *client = chip->client;

  /* Heater enabled 
   * Temperature and Humidity are acquired in sequence 
   * Temperature Measurement Resolution 14bit
   * Humidity Measurement Resolution 14bit
   */
  return i2c_smbus_write_word_swapped(client, HDC1000_CONFIG_REG, 0x3000);
}


static const struct iio_info hdc1000_info = {
	.driver_module = THIS_MODULE,
	.read_raw = &hdc1000_read_raw,
	.write_raw = &hdc1000_write_raw,
};

static int hdc1000_read_id(struct hdc1000_chip *chip, u32 *id)
{
	struct i2c_client *client = chip->client;
	int ret;

	ret = i2c_smbus_read_word_swapped(client, HDC1000_MANUFACTURER_ID_REG);
	if (ret < 0)
		return ret;

	*id = ret;
	return 0;
}

static int hdc1000_probe(struct i2c_client *client,
			 const struct i2c_device_id *device_id)
{

	struct iio_dev *indio_dev;
	struct hdc1000_chip *chip;
	int err = 0;
	u32 id = 0;

	indio_dev = iio_device_alloc(sizeof(*chip));
	if (!indio_dev)
		return -ENOMEM;

	chip = iio_priv(indio_dev);

	i2c_set_clientdata(client, chip);
	chip->client = client;

	err = hdc1000_read_id(chip, &id);
	if (err) {
		dev_err(&client->dev, "read id error %d\n", -err);
		goto fail1;
	}

	mutex_init(&chip->lock);

	dev_info(&client->dev, "model 0x%08x\n", id);
	indio_dev->name = client->name;
	indio_dev->channels = hdc1000_channels;
	indio_dev->num_channels = ARRAY_SIZE(hdc1000_channels);
	indio_dev->dev.parent = &client->dev;
	indio_dev->modes = INDIO_DIRECT_MODE;

  indio_dev->info = &hdc1000_info;

	err = hdc1000_configure(chip);
	if (err) {
		dev_err(&client->dev, "configure error %d\n", -err);
		goto fail2;
	}

	err = iio_device_register(indio_dev);
	if (err) {
		dev_err(&client->dev, "iio registration error %d\n", -err);
		goto fail3;
	}

	return 0;

fail3:
	flush_scheduled_work();
fail2:
fail1:
	iio_device_free(indio_dev);
	return err;
}

static int hdc1000_remove(struct i2c_client *client)
{
  struct hdc1000_chip *chip = i2c_get_clientdata(client);
	struct iio_dev *indio_dev = iio_priv_to_dev(chip);

	iio_device_unregister(indio_dev);
	hdc1000_set_power(chip, 0);
	iio_device_free(indio_dev);

	return 0;
}

#ifdef CONFIG_PM_SLEEP
static int hdc1000_suspend(struct device *dev)
{
	struct hdc1000_chip *chip = i2c_get_clientdata(to_i2c_client(dev));
	int ret;

	mutex_lock(&chip->lock);

	ret = hdc1000_set_power(chip, 0);
	if (ret)
		goto out;

	chip->suspended = true;

out:
	mutex_unlock(&chip->lock);
	return ret;
}

static int hdc1000_resume(struct device *dev)
{
	struct hdc1000_chip *chip = i2c_get_clientdata(to_i2c_client(dev));
	int ret;

	mutex_lock(&chip->lock);

	ret = hdc1000_set_power(chip, 1);
	if (ret)
		goto out;

	ret = hdc1000_configure(chip);
	if (ret)
		goto out;

	chip->suspended = false;

out:
	mutex_unlock(&chip->lock);
	return ret;
}

static SIMPLE_DEV_PM_OPS(hdc1000_pm_ops, hdc1000_suspend, hdc1000_resume);
#define TSL2563_PM_OPS (&tsl2563_pm_ops)
#else
#define TSL2563_PM_OPS NULL
#endif

static const struct i2c_device_id hdc1000_id[] = {
	{ "hdc1000", 0 },
	{ }
};

MODULE_DEVICE_TABLE(i2c, hdc1000_id);

static struct i2c_driver hdc1000_driver = {
	.driver = {
		.name	= "hdc1000",
		.pm	= &hdc1000_pm_ops,
		.owner	= THIS_MODULE,
	},
	.probe = hdc1000_probe,
	.remove = hdc1000_remove,
	.id_table = hdc1000_id,
};
module_i2c_driver(hdc1000_driver);

MODULE_AUTHOR("Matija Podravec <matija_podravec@fastmail.fm>");
MODULE_DESCRIPTION("HDC1000 Humidity and Temperature Sensor");
MODULE_LICENSE("GPL");
