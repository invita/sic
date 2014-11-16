<?php
namespace Zic2\Auth\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class IndexController extends AbstractActionController
{
    public function indexAction()
    {
        echo "zic 2";

        return $this->response;
    }
}