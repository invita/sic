<?php
return array(
    'router' => array(
        'routes' => array(
            'home' => array('type'=>'literal','options'=>array('route'=>'/','defaults'=>array('controller'=>'Sic\Admin\Controller\Index','action'=>'index'))),
            'login' => array('type'=>'literal','options'=>array('route'=>'/login','defaults'=>array('controller'=>'Sic\Admin\Controller\Index','action'=>'login'))),
            'logout' => array('type'=>'literal','options'=>array('route'=>'/logout','defaults'=>array('controller'=>'Sic\Admin\Controller\Index','action'=>'logout'))),
            'loadModule' => array('type'=>'literal','options'=>array('route'=>'/loadModule','defaults'=>array('controller'=>'Sic\Admin\Controller\Index','action'=>'loadModule'))),
            'callMethod' => array('type'=>'literal','options'=>array('route'=>'/callMethod','defaults'=>array('controller'=>'Sic\Admin\Controller\Index','action'=>'callMethod'))),
            'uploadFile' => array('type'=>'literal','options'=>array('route'=>'/uploadFile','defaults'=>array('controller'=>'Sic\Admin\Controller\Index','action'=>'uploadFile'))),
            'download' => array('type'=>'literal','options'=>array('route'=>'/download','defaults'=>array('controller'=>'Sic\Admin\Controller\Index','action'=>'download'))),
        ),
    ),
    'service_manager' => array(
        'abstract_factories' => array(
            'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
            'Zend\Log\LoggerAbstractServiceFactory',
        ),
        'aliases' => array(
            'translator' => 'MvcTranslator',
        ),
    ),
    'translator' => array(
        'locale' => 'en_US',
        'translation_file_patterns' => array(
            array(
                'type'     => 'gettext',
                'base_dir' => __DIR__ . '/../language',
                'pattern'  => '%s.mo',
            ),
        ),
    ),
    'controllers' => array(
        'invokables' => array(
            'Sic\Admin\Controller\Index' => 'Sic\Admin\Controller\IndexController'
        ),
    ),
    'view_manager' => array(
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => array(
            'layout/layout'           => __DIR__ . '/../view/layout/layout.phtml',

            'sic/admin/index/index'   => __DIR__ . '/../view/index/index.phtml',
            'sic/admin/index/login'   => __DIR__ . '/../view/index/login.phtml',

            'error/404'               => __DIR__ . '/../view/error/404.phtml',
            'error/index'             => __DIR__ . '/../view/error/index.phtml',
        ),
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
    ),
    // Placeholder for console routes
    'console' => array(
        'router' => array(
            'routes' => array(
            ),
        ),
    ),
    // session manager
    'session' => array(
        'config' => array(
            'class' => 'Zend\Session\Config\SessionConfig',
            'options' => array(
                'name' => 'sic2',
                'gc_maxlifetime' => 3600 *48,
                'cookie_lifetime' => 3600 *48
            ),
        ),
        'storage' => 'Zend\Session\Storage\SessionArrayStorage',
        'validators' => array(
            'Zend\Session\Validator\RemoteAddr',
            'Zend\Session\Validator\HttpUserAgent',
        ),
    ),
    'sic' => array(
        'uploadPath' => 'data/upload',
        'downloadPath' => 'data/download',
        'solrConfigPaths' => array(
            'schema.xml' => 'opt/solr-4.9.1/example/solr/collection1/conf',
            'data-config.xml' => 'opt/solr-4.9.1/example/solr/collection1/conf',
            'solrconfig.xml' => 'opt/solr-4.9.1/example/solr/collection1/conf',
        ),
        'solrUrl' => 'http://sici.sistory.si:8983/solr'
    ),
);