<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Literal;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;

class PubList extends SicModuleAbs {

    public function defineSqlSelect($args, Select $select)
    {
        $select->from('publication');
    }

    public function defineSqlDelete($args, Delete $delete)
    {
        $data = Util::getArg($args, 'data', null);
        $id = Util::getArg($data, 'id', 0);
        //if (!$id) return false;
        $delete->from('publication_author')->where(array("publication_id" => $id));
        $delete->from('publication_title')->where(array("publication_id" => $id));
        $delete->from('publication')->where(array("id" => $id));
    }

    /*

    public function dataTableSelect($args) {

        $adapter = GlobalAdapterFeature::getStaticAdapter();

        $sql = new Sql($adapter);
        $select = $sql->select()->from('publication');
        $statement = $sql->prepareStatementForSqlObject($select);
        $results = $statement->execute();

        $publications = array();

        foreach($results as $result) {
            $publications[] = $result;
        }

        return array('data' => $publications);
    }

    public function dataTableDelete($args) {

        $data = $args['data'];
        $id = $data['id'];

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $conn = $adapter->getDriver()->getConnection();

        $conn->beginTransaction();
        try
        {
            $sql = new Sql($adapter);
            $delete = $sql->delete("publication")->where(array("id"=>$id));
            $sql->prepareStatementForSqlObject($delete)->execute();

            $conn->commit();

        } catch(\Exception $e)
        {
            $conn->rollback();
        }

        return $this->dataTableSelect($args);
    }
    */
}
