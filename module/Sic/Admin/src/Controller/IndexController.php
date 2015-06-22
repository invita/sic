<?php
namespace Sic\Admin\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\Mvc\MvcEvent;

use Zend\Authentication\AuthenticationService;

use Sic\Admin\Models\Authentication\Adapter;
use Sic\Admin\Models\Authentication\ReCaptcha;
use Sic\Admin\Models\Util;

class IndexController extends AbstractActionController
{
    private $hasIdentity;

    public function onDispatch( MvcEvent $e )
    {
        $auth = new AuthenticationService();

        $this->hasIdentity = $auth->hasIdentity();
        $this->layout()->setVariable("hasIdentity", $this->hasIdentity);
        if ($this->hasIdentity){
            $identity = $auth->getIdentity();
            $username = isset($identity['username']) ? $identity['username'] : '';
            $this->layout()->setVariable("username", $username);
        }

        return parent::onDispatch( $e );
    }

    public function indexAction()
    {
        if( $this->hasIdentity )
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
            $gRecaptchaResponse= $request->getPost("g-recaptcha-response");
            $reCaptcha = new ReCaptcha("6LcTNQETAAAAANY86werDyiieJyifTMmQexu1Rem");
            $response = $reCaptcha->verifyResponse($_SERVER["REMOTE_ADDR"], $gRecaptchaResponse);

            //var_dump($response);
            //die();

            $username = $request->getPost("username");
            $password = $request->getPost("password");

            $authAdapter = new Adapter($username, $password);
            $auth = new AuthenticationService();
            $result = $auth->authenticate($authAdapter);

            echo json_encode(array("status"=>$result->isValid()));
            die();
        }

        return $view;
    }

    public function logoutAction()
    {
        $auth = new AuthenticationService();
        $auth->clearIdentity();

        return $this->redirect()->toUrl('/');
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

    // Upload File
    public function uploadFileAction()
    {
        //print_r($_POST); print_r($_FILES); die();

        $uploadPath = Util::getUploadPath();
        $fileNamePrefix = Util::getArg($_POST, 'fileNamePrefix', '');

        $respData = array();
        foreach($_FILES as $file) {
            $success = move_uploaded_file($file['tmp_name'], $uploadPath . $fileNamePrefix . basename($file['name']));
            $respData[$file['name']] = $success;
        }

        $result = array('data' => $respData);

        echo json_encode($result);

        exit;
    }

    public function downloadAction()
    {
        $downloadPath = Util::getDownloadPath();
        $fileName = Util::getArg($_GET, "fileName", "");

        if ($fileName && file_exists($downloadPath."/".$fileName)) {
            header('Content-Type: application/xml');
            echo file_get_contents($downloadPath."/".$fileName);
        } else {
            echo "File not found";
        }

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