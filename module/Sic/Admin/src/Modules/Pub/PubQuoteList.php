<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;
use Zend\Db\Adapter\Driver\ResultInterface;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Sic\Admin\Modules\Pub\PubEdit;

class PubQuoteList extends SicModuleAbs {

    public function defineSqlSelect($args, Select $select)
    {
        $staticData = Util::getArg($args, 'staticData', null);
        $pub_id = Util::getArg($staticData, 'pub_id', 0);
        $select->from('quote')
            ->columns(array("quote_id", "pub_id", "pub_page", "quoted_pub_id", "quoted_pub_page"))
            ->where(array('pub_id' => $pub_id));
    }

    public function defineDataTableResponseData($args, ResultInterface $result) {
        $responseData = array();
        foreach($result as $row) {
            $row['quoted_creator'] = PubEdit::getCreatorShort($row['quoted_pub_id']);
            $row['quoted_title'] = PubEdit::getTitleShort($row['quoted_pub_id']);
            $responseData[] = $row;
        }
        return $responseData;
    }

    public function defineSqlDelete($args, Delete $delete)
    {
        $data = Util::getArg($args, 'data', null);
        $quote_id = Util::getArg($data, 'quote_id', 0);
        $delete->from('quote')->where(array("quote_id" => $quote_id));
    }

}
