<?php
return array(
    'modules' => array(
        //'Zic2\\Core',
        //'Zic2\\Auth',
        //'Zic2\\Admin',
        //'Zic2\\Home',
        'Sic\\Admin'
    ),
    'module_listener_options' => array(
        'module_paths' => array(
            './module'
        ),
        'config_glob_paths' => array(
            'config/autoload/{,*.}{global,local}.php',
        ),
    ),
);