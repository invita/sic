<?php
namespace Sic\Admin\Models;

class Util
{
    public static function getArg($args, $key, $defaultValue){
        if (!$args || !$key || !isset($args[$key])) return $defaultValue;
        $result = $args[$key];
        if (is_numeric($defaultValue)) $result = intval($result);
        if (is_array($defaultValue)) $result = is_array($result) ? $result : array($result);
        return $result;
    }
}