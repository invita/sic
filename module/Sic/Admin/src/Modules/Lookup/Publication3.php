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

        $authors = DbUtil::selectFrom('publication_author', 'author', array("pub_id" => $pub_id));
        $titles = DbUtil::selectFrom('publication_title', 'title', array("pub_id" => $pub_id));

        $authorStr = "";
        if (count($authors)) $authorStr = $authors[0];

        $titleStr = "";
        if (count($titles)) $titleStr = $titles[0];

        if ($authorStr && $titleStr)
            $resolveValue = $authorStr.": ".$titleStr;
        else if ($authorStr && !$titleStr)
            $resolveValue = 'Author: '.$authorStr;
        else if (!$authorStr && $titleStr)
            $resolveValue = 'Title: '.$titleStr;
        else
            $resolveValue = '';

        return array("resolveValue" => $resolveValue);
    }
}
