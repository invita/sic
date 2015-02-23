<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\Sql\Expression;
use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;

class PubList {
    public function dataTableSelect($args) {

        $adapter = GlobalAdapterFeature::getStaticAdapter();

        $sql = new Sql($adapter);

        $select = $sql->select()
            ->from("publication")
            ->join("publication_author", 'publication_author.publication_id = publication.id',
                array("author" => new Expression("group_concat(author separator ', ')")), \Zend\Db\Sql\Select::JOIN_LEFT)
            ->join("publication_title", 'publication_title.publication_id = publication.id',
                array("title" => new Expression("group_concat(title separator ', ')")), \Zend\Db\Sql\Select::JOIN_LEFT)
            ->group("publication.id");


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
}
