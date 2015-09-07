<?php
namespace Sic\Admin\Models;

use Zend\Authentication\AuthenticationService;

class Util
{
    protected static $dict = array();
    public static $mimeTypes = array(
        '_default' => 'text/plain',
        'xml' => 'application/xml',
        'png' => 'image/png', 'jpg' => 'image/jpeg',
        'zip' => 'application/zip',
        'pdf' => 'application/pdf',
        'doc' => 'application/msword', 'docx' => 'application/msword',
        'xls' => 'application/vnd.ms-excel', 'xlsx' => 'application/vnd.ms-excel',
        'csv' => 'text/csv',
    );

    public static function getArg($args, $key, $defaultValue){
        if (!$args || !$key || !isset($args[$key])) return $defaultValue;
        $result = $args[$key];
        if (is_numeric($defaultValue)) $result = intval($result);
        if (is_array($defaultValue)) $result = is_array($result) ? $result : array($result);
        return $result;
    }

    public static function getUploadPath() {
        return realpath(self::get('uploadPath')).'/';
    }

    public static function getDownloadPath() {
        return realpath(self::get('downloadPath')).'/';
    }

    public static function getSolrConfigPath($fileName) {
        $solrConfigPaths = self::get('solrConfigPaths');
        if (!$solrConfigPaths) return false;

        if (isset($solrConfigPaths[$fileName])) {
            return realpath($solrConfigPaths[$fileName]).'/';
        }

        return false;
    }

    public static function getSolrUrl() {
        return self::get('solrUrl');
    }


    public static function set($key, $val) {
        self::$dict[$key] = $val;
    }
    public static function get($key) {
        return isset(self::$dict[$key]) ? self::$dict[$key] : null;
    }

    public static function getUserId() {
        if (isset($_SESSION["Zend_Auth"]) && isset($_SESSION["Zend_Auth"]['storage'])
            && isset($_SESSION["Zend_Auth"]['storage']["id"]))
                return $_SESSION["Zend_Auth"]['storage']["id"];

        return 0;
    }

    public static function shortenText($text, $length) {
        if (strlen($text) > $length) $text = substr($text, 0, $length)."...";
        return $text;
    }

    public static function getXmlFieldValue($entity, $fieldName, $asArray = false, $xPathFilter = "", $sep = ', ') {
        $nodes = $entity->xpath($fieldName.$xPathFilter);
        $result = array();
        foreach ($nodes as $idx => $node)
        {
            $result[] = trim((string)$node);
        }

        if (!$asArray) $result = join($sep, $result);

        return $result;
    }

    public static function getMimeTypeFromFileName($fileName) {
        // 'application/xml'
        $ext = pathinfo($fileName, PATHINFO_EXTENSION);

        if ($ext && isset(self::$mimeTypes[$ext]))
            return self::$mimeTypes[$ext];

        return self::$mimeTypes['_default'];
    }

    public static function hasPermission($powerLevel, $actionName) {

        $permMap = array(
            "searchModule" => true,
            "systemModule" => false,
            "scriptsModule" => false,
            "usersModule" => false,
            "entitiesModule" => true,
            "projectModule" => true,
            "regularModule" => false,

            "System/ImportEntities" => false,
        );

        if ($powerLevel == 'superUser') return true;
        else return $permMap[$actionName];
    }

    public static function userHasPermission($actionName) {
        $auth = new AuthenticationService();
        $identity = $auth->getIdentity();
        $powerLevel = isset($identity['power']) ? $identity['power'] : 0;
        return self::hasPermission($powerLevel, $actionName);
    }
}