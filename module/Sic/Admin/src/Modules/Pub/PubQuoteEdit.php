<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;

class PubQuoteEdit
{
    public function quoteSelect($args)
    {

        $quote_id = Util::getArg($args, 'quote_id', 0);
        $row = DbUtil::selectRow('quote', null, array('quote_id' => $quote_id));
        return array('data' => $row);
    }

    public function quoteUpdate($args)
    {

        $quote_id = Util::getArg($args, 'quote_id', 0);
        if (!$quote_id) return $this->quoteInsert($args);

        $data = Util::getArg($args, 'data', array());
        $pub_id = Util::getArg($data, 'pub_id', 0);

        $quoteData = array(
            'pub_id' => $pub_id,
            'on_page' => Util::getArg($data, 'on_page', 0),
            'quoted_pub_id' => Util::getArg($data, 'quoted_pub_id', 0),
            'cited_page' => Util::getArg($data, 'cited_page', 0)
        );
        DbUtil::updateTable('quote', $quoteData, array('quote_id' => $quote_id));

        DbUtil::touchQuote($quote_id);
        if ($pub_id) DbUtil::touchPublication($pub_id);

        return $this->quoteSelect($args);
    }

    public function quoteInsert($args)
    {
        $data = Util::getArg($args, 'data', array());
        $pub_id = Util::getArg($data, 'pub_id', 0);

        $quoteData = array(
            'pub_id' => $pub_id,
            'on_page' => Util::getArg($data, 'on_page', 0),
            'quoted_pub_id' => Util::getArg($data, 'quoted_pub_id', 0),
            'cited_page' => Util::getArg($data, 'cited_page', 0)
        );
        DbUtil::insertInto('quote', $quoteData);

        $args['quote_id'] = DbUtil::$lastInsertId;

        DbUtil::touchQuote($args['quote_id']);
        if ($pub_id) DbUtil::touchPublication($pub_id);

        return $this->quoteSelect($args);
    }


    public function duplicateQuote($args)
    {
        $quote_id = Util::getArg($args, 'quote_id', 0);
        if (!$quote_id) {
            return array('status' => false, 'alert' => 'Save citation first!');
        }
        $quote = DbUtil::selectRow('quote', null, array('quote_id' => $quote_id));
        if (!$quote) {
            return array('status' => false, 'alert' => 'Citation not found!');
        }

        unset($quote['quote_id']);
        DbUtil::insertInto('quote', $quote);
        $new_quote_id = DbUtil::$lastInsertId;

        DbUtil::touchQuote($new_quote_id);
        if ($quote['pub_id']) DbUtil::touchPublication($quote['pub_id']);

        return array('status' => true, 'quote_id' => $new_quote_id);
    }
}
