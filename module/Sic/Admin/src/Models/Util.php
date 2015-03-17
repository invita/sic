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

    public static function set($key, $val) {
        self::$dict[$key] = $val;
    }
    public static function get($key) {
        return isset(self::$dict[$key]) ? self::$dict[$key] : null;
    }
}