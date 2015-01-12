<?php
return array(
    'router' => array(
        'routes' => array(
            'home_index_index' => array('type'=>'literal', 'options'=>array('route'=>'/foo/bar', 'defaults'=>array('controller'=>'home_index','action'=>'index'))),

            /*
            'home' => array(
                'type' => 'Zend\Mvc\Router\Http\Literal',
                'options' => array(
                    'route' => '/',
                    'defaults' => array(
                        'controller' => 'Zic2\Home\Controller\Index',
                        'action' => 'index',
                        //'layout' => 'layout',
                    ),
                ),
            ),
            */
        ),
    ),
    'controllers' => array(
        'invokables' => array(
            'home_index' => 'Zic2\Home\Controller\IndexController'
        ),
    ),

    /*
    'view_manager' => array(
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => array(
            'layout/layout'           => __DIR__ . '/../view/layout/layout.phtml',
            //'application/index/index' => __DIR__ . '/../view/application/index/index.phtml',
            'error/404'               => __DIR__ . '/../view/error/404.phtml',
            'error/index'             => __DIR__ . '/../view/error/index.phtml',
        ),
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
    ),
    */
    /*
    'view_manager' => array(
        'template_path_stack' => array(
            'home' => realpath(__DIR__ . '/../view'),
        ),
        'template_map' => array(
            'layout/layout' =>  __DIR__ . '/..//view/layout/layout.phtml',
            'zic2/index/index' => realpath(__DIR__.'/../view') . '/index.phtml',

            'error/404' => __DIR__ . '/../../Home/view/error/404.phtml',
            'error/index' => __DIR__ . '/../../Home/view/error/index.phtml',
            'error' => __DIR__ . '/../../Home/view/error/index.phtml',
        ),
        'not_found_template' => 'error/404',
        'exception_template' => 'error/index',
    ),
    */
);