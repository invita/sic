<?php
namespace Sic\Admin\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

use Zend\Authentication\AuthenticationService;

use Sic\Admin\Models\Authentication\Adapter;

class IndexController extends AbstractActionController
{
    public function indexAction()
    {
        $auth = new AuthenticationService();
        if( $auth->hasIdentity() )
        {
            $view = new ViewModel();
            $view->setTemplate("sic/admin/index/index");

            return $view;
        }

        return $this->redirect()->toUrl('/login');
    }

    public function loginAction()
    {
        $view = new ViewModel();
        $view->setTemplate("sic/admin/index/login");

        $request = $this->getRequest();
        if($request->isPost())
        {
            $username = $request->getPost("username");
            $password = $request->getPost("password");

            $authAdapter = new Adapter($username, $password);
            $auth = new AuthenticationService();
            $result = $auth->authenticate($authAdapter);

            if(!$result->isValid())
            {


            } else
            {
                return $this->redirect()->toUrl('/');
            }
        }

        return $view;
    }

    // Load Module
    public function loadModuleAction()
    {
        $args = isset($_POST["args"]) ? $_POST["args"] : array();
        $origModuleName = isset($args["moduleName"]) ? $args["moduleName"] : null;
        $moduleInfo = $this->getModuleInfo($origModuleName);
        $jsFileName = $moduleInfo['moduleName'] . '.js';
        $jsF = file_get_contents($moduleInfo['moduleDir'] .'/'. $jsFileName);

        $result = array(
            "args" => $args,
            "F" => $jsF
        );

        echo json_encode($result);

        exit;
    }

    // Call Server Method
    public function callMethodAction()
    {
        $args = isset($_POST["args"]) ? $_POST["args"] : array();
        $origModuleName = isset($args["moduleName"]) ? $args["moduleName"] : null;
        $methodName = isset($args["methodName"]) ? $args["methodName"] : null;
        $moduleInfo = $this->getModuleInfo($origModuleName);
        $className = $moduleInfo['moduleNamespace']."\\".$moduleInfo['moduleName'];
        $fileName = $moduleInfo['moduleDir'] . '/' .$moduleInfo['moduleName'].'.php';

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

    private function getModuleInfo($moduleName){
        $moduleInfo = array();

        $moduleInfo['fullModuleName'] = $moduleName;
        $moduleInfo['moduleDir'] = realpath(__DIR__ . '/../Modules');
        $moduleInfo['moduleName'] = $moduleName;
        $moduleInfo['moduleNamespace'] = 'Sic\Admin\Modules';

        $slashPos = strrpos($moduleName, '/');
        if ($slashPos !== false) {
            $moduleInfo['moduleDir'] .= '/'.substr($moduleName, 0, $slashPos);
            $moduleInfo['moduleName'] = substr($moduleName, $slashPos +1);
            $moduleInfo['moduleNamespace'] .= '\\'.str_replace('/', '\\', substr($moduleName, 0, $slashPos));
        }

        return $moduleInfo;
    }

}