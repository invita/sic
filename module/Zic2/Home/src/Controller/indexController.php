<?php
namespace Zic2\Home\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class IndexController extends AbstractActionController
{
    public function indexAction()
    {
        die("home index controller index action");
        return array();
    }

    public function barAction()
    {
        die("home index controller bar action");
        return array();
    }
}