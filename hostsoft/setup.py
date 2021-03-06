from setuptools import setup, find_packages

setup(
    name='myoctopus',
    version='0.0.1',
    url='http://github.com/wawrow/myoctopus/',
    license='BSD',
    author='wawrzyniec Wawro',
    author_email='wawrzyniec@wawro.eu',
    description='Host software for MyOctopus project',
    packages=find_packages(),
    include_package_data=True,
    platforms='any',
    install_requires=[
        'Flask>=0.0.1',
    ],
    package_data={'dashboard-21': ['*']}   
)