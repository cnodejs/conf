hu.js
=======
hujs.org
=============================

Website for 沪JS 2012.

Currently deployed to NAE at [http://hujs.org](http://hujs.org).


DEPLOYMENT
----------

To deploy to Aliyun, use a tool called [git-ftp](https://github.com/resmo/git-ftp). Please follow the installation instructions on the project page.

Make your changes, and perform the normal ``git add`` and ``git commit`` actions. 

To deploy use this command from the project root:

```
git ftp push -u hujs2012 -p - ftp://ftp.ace.aliyun.com:2222
```

Contact [@thoward](http://github.com/thoward) for deployment password.
