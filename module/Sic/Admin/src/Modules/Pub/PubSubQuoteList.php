<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Update;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;
use Zend\Db\Adapter\Driver\ResultInterface;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Sic\Admin\Modules\Pub\PubEdit;

class PubSubQuoteList extends SicModuleAbs {

    public function defineSqlSelect($args, Select $select)
    {
        $staticData = Util::getArg($args, 'staticData', null);
        $parentRow = Util::getArg($staticData, 'parentRow', null);
        $pub_id = Util::getArg($staticData, 'pub_id', 0);
        $parent_quote_id = Util::getArg($parentRow, 'quote_id', 0);

        $select->from('quote')//->join('publication', array())
            ->columns(array("quote_id", "pub_id", "on_page", "quoted_pub_id", "cited_page"))
            ->where(array('pub_id' => $pub_id, 'parent_quote_id' => $parent_quote_id));
    }

    public function defineDataTableResponseData($args, ResultInterface $result) {
        $responseData = array();
        foreach($result as $row) {
            $newRow = array(
                "quote_id" => $row['quote_id'],
                "pub_id" => $row['pub_id'],
                "on_page" => $row['on_page'],
                "quoted_pub_id" => $row['quoted_pub_id'],
                "quoted_creator" => PubEdit::getCreatorShort($row['quoted_pub_id']),
                "quoted_title" => PubEdit::getTitleShort($row['quoted_pub_id']),
                "cited_page" => $row['cited_page'],
            );
            $responseData[] = $newRow;
        }
        return $responseData;
    }

    public function defineSqlDelete($args, Delete $delete)
    {
        $data = Util::getArg($args, 'data', null);
        $quote_id = Util::getArg($data, 'quote_id', 0);
        $pub_id = DbUtil::selectOne('quote', 'pub_id', array('quote_id' => $quote_id));
        $delete->from('quote')->where(array("quote_id" => $quote_id));

        if ($pub_id) DbUtil::touchPublication($pub_id);
    }

    public function defineSqlUpdateRow($args, Update $update)
    {
        $data = Util::getArg($args, 'data', null);
        $orig = Util::getArg($data, 'orig', null);
        $row = Util::getArg($data, 'row', null);
        $quote_id = Util::getArg($orig, 'quote_id', 0);
        if ($quote_id) {
            $updateFields = array(
                "on_page" => Util::getArg($row, 'on_page', null),
                "quoted_pub_id" => Util::getArg($row, 'quoted_pub_id', null),
                "cited_page" => Util::getArg($row, 'cited_page', null)
            );
            $update->table('quote')->set($updateFields)->where(array("quote_id" => $quote_id));

            DbUtil::touchQuote($quote_id);

            $pub_id = DbUtil::selectOne('quote', 'pub_id', array('quote_id' => $quote_id));
            if ($pub_id) DbUtil::touchPublication($pub_id);
        }
    }

}
