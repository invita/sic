<?php
namespace Sic\Admin\Models\Authentication;

use Zend\Authentication\Adapter\AdapterInterface;
use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Authentication\Result;

class Adapter implements AdapterInterface
{
    private $username;
    private $password;

    public function __construct($username, $password)
    {
        $this->username = $username;
        $this->password = $password;
    }

    public function authenticate()
    {
        $adapter = GlobalAdapterFeature::getStaticAdapter();

        $sql = new Sql($adapter);
        $select = $sql->select()->from('user')->where(array('username' => $this->username, "password" => sha1($this->password)));
        $statement = $sql->prepareStatementForSqlObject($select);
        $results = $statement->execute();
        $row = $results->current();

        if($row && is_array($row))
        {
            return new Result(Result::SUCCESS, $row);
        }

        return new Result(Result::FAILURE, null);
    }
}