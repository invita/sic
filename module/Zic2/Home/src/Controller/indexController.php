<?php
namespace Zic2\Home\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class IndexController extends AbstractActionController
{
    public function indexAction()
    {
        $adapter = \Zend\Db\TableGateway\Feature\GlobalAdapterFeature::getStaticAdapter();

        $users = $adapter->query("select * from users");

        var_dump($users);


        die("home index controller index action");
        return array();
    }

    public function barAction()
    {
        die("home index controller bar action");
        return array();
    }
}