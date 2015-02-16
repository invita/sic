<?php
namespace Sic\Admin\Models\IO;

class Console
{
    public static function passthru($cmd){
        ob_start();
        passthru($cmd, $return);
        $content = ob_get_contents();
        ob_end_clean();
        return $content;
    }
}