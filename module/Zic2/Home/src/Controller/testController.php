<?php
namespace Zic2\Home\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class TestController extends AbstractActionController
{
    public function indexAction()
    {


        echo json_encode(array("a" => 1, "F" => "F = function() { alert('Hai :D'); };"));

        die();
        //print_r($this->layout());

        //return array();
    }
}