<?php
namespace Sic\Admin\Models;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Where;
use Zend\Db\Sql\Predicate\Operator;
use Zend\Db\Adapter\Driver\ResultInterface;
use Sic\Admin\Models\Util;

abstract class SicLookupAbs
{
    public function resolve($args) {


    }
}