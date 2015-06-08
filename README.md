# myoctopus-hostsoft

to run use:
python run.py

to access datastore from within the eval you can now use api, example:
```python
import hostsoft.network.api as api

def main():
    api.put('test_key', 'some_value')
    return api.read('test_key')
```
