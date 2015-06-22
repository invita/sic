<?php
namespace Sic\Admin\Models;

class Util
{
    protected static $dict = array();

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
}