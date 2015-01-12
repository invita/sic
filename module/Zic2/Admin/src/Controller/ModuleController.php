<?php
namespace Zic2\Admin\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class ModuleController extends AbstractActionController
{
    public function loadModuleAction()
    {
        $moduleDir = realpath(__DIR__ . '/../modules');
        $jsFileName = "testModule.js";

        $jsF = file_get_contents($moduleDir .'/'. $jsFileName);
        $args = isset($_POST["args"]) ? $_POST["args"] : array();

        $result = array(
            "args" => $args,
            "F" => $jsF
        );

        echo json_encode($result);

        exit;
    }

    public function callMethodAction()
    {
        $moduleDir = realpath(__DIR__ . '/../modules');
        $moduleNamespace = "Zic2\\Admin\\Modules";

        $args = isset($_POST["args"]) ? $_POST["args"] : array();
        //$moduleName = isset($args["moduleName"]) ? $args["moduleName"] : null;
        //$methodName = isset($args["methodName"]) ? $args["methodName"] : null;
        $moduleName = isset($args["moduleName"]) ? $args["moduleName"] : "TestModule";
        $methodName = isset($args["methodName"]) ? $args["methodName"] : "testMethod";
        $className = $moduleNamespace."\\".$moduleName;
        $fileName = $moduleDir . '/' .ucfirst($moduleName).'.php';
        if (file_exists($fileName))
            include $fileName;

        $result = array();

        if (method_exists($className,  $methodName)) {
            $obj = new $className();
            $result = $obj->$methodName($args);
        }

        echo json_encode($result);

        exit;
    }
}
