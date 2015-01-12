<?php
return array(
    'router' => array(
        'routes' => array(
            'admin_index' => array(
                'type' => 'Zend\Mvc\Router\Http\Literal',
                'options' => array(
                    'route' => '/admin',
                    'defaults' => array(
                        'controller' => 'Zic2\Admin\Controller\Index',
                        'action'     => 'admin',
                    ),
                ),
            ),
        ),
    ),
    'controllers' => array(
        'invokables' => array(
            'Zic2\Admin\Controller\Index' => 'Zic2\Admin\Controller\IndexController'
        ),
    ),
    'view_manager' => array(
        //'template_path_stack' => array(
        //    'admin' => realpath(__DIR__ . '/../view'),
        //),
        /*
        'template_map' => array(
            'layout/admin' => realpath(__DIR__.'/../view/layout') . '/admin-layout.phtml',
            'zic2/admin/index/admin' => realpath(__DIR__.'/../view') . '/index.phtml',
        ),
        */
    ),
);