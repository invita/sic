<?php
namespace Zic2\Home\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class FooController extends AbstractActionController
{
    public function indexAction()
    {
        die("home foo controller index action");
        return array();
    }

    public function barAction()
    {
        die("home foo controller bar action");
        return array();
    }
}