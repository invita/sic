<?php
namespace Sic\Admin\Modules\Lookup;

use Sic\Admin\Models\DbUtil;
use Sic\Admin\Models\SicLookupAbs;
use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;
use Sic\Admin\Models\Util;

class Publication extends SicLookupAbs {
    public function resolve($args) {

        $pub_id = Util::getArg($args, 'pub_id', 0);

        $creators = DbUtil::selectFrom('publication_creator', 'creator', array("pub_id" => $pub_id, "code_id" => 1));
        $titles = DbUtil::selectFrom('publication_title', 'title', array("pub_id" => $pub_id));

        $creatorStr = "";
        if (count($creators)) $creatorStr = $creators[0];

        $titleStr = "";
        if (count($titles)) $titleStr = $titles[0];

        if ($creatorStr && $titleStr)
            $resolveValue = $creatorStr.": ".$titleStr;
        else if ($creatorStr && !$titleStr)
            $resolveValue = 'Creator: '.$creatorStr;
        else if (!$creatorStr && $titleStr)
            $resolveValue = 'Title: '.$titleStr;
        else
            $resolveValue = '';

        return array("resolveValue" => $resolveValue);
    }
}
