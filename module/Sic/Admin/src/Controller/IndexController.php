<?php
namespace Sic\Admin\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class IndexController extends AbstractActionController
{
    public function indexAction()
    {
        $view = new ViewModel();
        $view->setTemplate("sic/admin/index/index");

        return $view;
    }

    public function loginAction()
    {
        $view = new ViewModel();
        $view->setTemplate("sic/admin/index/login");

        return $view;
    }

}