<?php
namespace Sic\Admin\Modules\System;

use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;

class Codes
{
    public function getCodes($args)
    {
        $result = array(
            "pubCreator" => DbUtil::selectFrom("codes_pub_creator"),
            "pubIdno" => DbUtil::selectFrom("codes_pub_idno"),
            "pubSource" => DbUtil::selectFrom("codes_pub_source"),
            "pubOnline" => DbUtil::selectFrom("codes_pub_online"),
        );
        return $result;
    }
}
