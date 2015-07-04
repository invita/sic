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

    public function getCodesMap() {
        $codes = $this->getCodes(null);

        $result = array();
        foreach ($codes as $codeName => $codesTable) {
            $result[$codeName] = array();
            foreach ($codesTable as $codeRow) {
                $codeId = $codeRow['code_id'];
                $value = $codeRow['value'];
                $result[$codeName][$codeId] = $value;
            }
        }
        return $result;
    }
}
