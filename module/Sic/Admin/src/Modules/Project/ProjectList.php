<?php
namespace Sic\Admin\Modules\Project;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;

class ProjectList {
    public function dataTableSelect($args) {

        /*
        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select()->from('publication');
        $statement = $sql->prepareStatementForSqlObject($select);
        $results = $statement->execute();

        $publications = array();

        foreach($results as $result) {
            $publications[] = $result;
        }
        */

        return array('data' => array(
            array("id" => 1, "title" => "Project 1"),
            array("id" => 2, "title" => "Project 2")
        ));
    }

    public function dataTableDelete($args) {

        /*
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

        */
        return $this->dataTableSelect($args);
    }
}
