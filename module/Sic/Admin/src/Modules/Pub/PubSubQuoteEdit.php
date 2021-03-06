<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;

class PubSubQuoteEdit {
    public function quoteSelect($args) {

        $quote_id = Util::getArg($args, 'quote_id', 0);
        $row = DbUtil::selectRow('quote', null, array('quote_id' => $quote_id));
        return array("data" => $row);
    }

    public function quoteUpdate($args) {

        $quote_id = Util::getArg($args, 'quote_id', 0);
        if (!$quote_id) return $this->quoteInsert($args);

        $data = Util::getArg($args, 'data', array());

        $quoteData = array(
            "pub_id" => Util::getArg($data, 'pub_id', 0),
            "on_page" => Util::getArg($data, 'on_page', 0),
            "quoted_pub_id" => Util::getArg($data, 'quoted_pub_id', 0),
            "cited_page" => Util::getArg($data, 'cited_page', 0)
        );
        DbUtil::updateTable('quote', $quoteData, array('quote_id' => $quote_id));

        return $this->quoteSelect($args);
    }

    public function quoteInsert($args)
    {
        $data = Util::getArg($args, 'data', array());

        $quoteData = array(
            "pub_id" => Util::getArg($data, 'pub_id', 0),
            "parent_quote_id" => Util::getArg($data, 'parent_quote_id', 0),
            "on_page" => Util::getArg($data, 'on_page', 0),
            "quoted_pub_id" => Util::getArg($data, 'quoted_pub_id', 0),
            "cited_page" => Util::getArg($data, 'cited_page', 0)
        );
        DbUtil::insertInto('quote', $quoteData);

        $args['quote_id'] = DbUtil::$lastInsertId;

        return $this->quoteSelect($args);
    }

}
