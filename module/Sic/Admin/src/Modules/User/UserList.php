<?php
namespace Sic\Admin\Modules\User;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;

class UserList {
    public function dataTableSelect($args) {
        $users = array();

        //print_r($args); die();
        $sortField = isset($args['sortField']) ? $args['sortField'] : null;
        $sortOrder = isset($args['sortOrder']) ? $args['sortOrder'] : "asc";
        $pageStart = isset($args['pageStart']) ? intval($args['pageStart']) : 0;
        $pageCount = isset($args['pageCount']) ? intval($args['pageCount']) : 20;

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select()->from('user');

        if ($sortField) $select->order($sortField." ".$sortOrder);
        $select->limit($pageCount);
        $select->offset($pageStart);

        $statement = $sql->prepareStatementForSqlObject($select);
        $results = $statement->execute();

        // Get row count
        $select = $sql->select()->from('user')->columns(array("count" => new \Zend\Db\Sql\Expression('COUNT(*)')));
        $statement = $sql->prepareStatementForSqlObject($select);
        $rowCountResult = $statement->execute();
        $rowCount = $rowCountResult->current()['count'];

        foreach($results as $result) {
            unset($result['password']);
            $result['password'] = '(hidden)';
            $users[] = $result;
        }

        return array('data' => $users, 'rowCount' => $rowCount);
    }

    public function dataTableDelete($args) {

        $data = isset($args['data']) ? $args['data'] : null;
        if ($data) {
            $adapter = GlobalAdapterFeature::getStaticAdapter();
            $sql = new Sql($adapter);
            $delete = $sql->delete()->from('user')->where(array("id" => $data['id']));
            $statement = $sql->prepareStatementForSqlObject($delete);
            $results = $statement->execute();
        }

        return $this->dataTableSelect($args);
    }
}
