<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Authentication\Result;
use Zend\Math\BigInteger\Exception\DivisionByZeroException;

class PubEdit {
    public function pubSelect($args) {

        $id = $args['id'];

        $adapter = GlobalAdapterFeature::getStaticAdapter();

        $sql = new Sql($adapter);
        $select = $sql->select()->from('publication')->where(array("id"=>$id));
        $statement = $sql->prepareStatementForSqlObject($select);
        $results = $statement->execute();

        foreach($results as $result) {
            $publication = $result;
        }

        return array("data" => $publication);
    }

    public function pubUpdate($args) {

        $id = isset($args["id"]) ? $args["id"] : null;
        if (!$id) return $this->pubInsert($args);

        $data = $args["data"];
        $parentId = isset($data["parentId"]) ? $data["parentId"] : 0;
        $year = isset($data["year"]) ? $data["year"] : 0;
        $cobiss = isset($data["cobiss"]) ? $data["cobiss"] : 0;
        $issn = isset($data["issn"]) ? $data["issn"] : 0;
        $originalId = isset($data["originalId"]) ? $data["originalId"] : 0;

        $authors = isset($data["authorName"]) ? $data["authorName"] : array();
        $titles = isset($data["title"]) ? $data["title"] : array();

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $conn = $adapter->getDriver()->getConnection();

        $conn->beginTransaction();
        try
        {
            $sql = new Sql($adapter);

            $values = array(
                "parent_id" => $parentId,
                "year" => $year,
                "cobiss" => $cobiss,
                "issn" => $issn,
                "original_id" => $originalId
            );
            $update = $sql->update("publication")->set($values)->where(array("id"=>$id));
            $sql->prepareStatementForSqlObject($update)->execute();

            $delete = $sql->delete("publication_author")->where(array("id"=>$id));
            $sql->prepareStatementForSqlObject($delete)->execute();
            $values = array("publication_id"=>$id);
            for($c=0; $c<count($authors); $c++)
            {
                $values["author"] = $authors[$c];
                $insert = $sql->insert("publication_author")->values($values);
                $sql->prepareStatementForSqlObject($insert)->execute();
            }

            $delete = $sql->delete("publication_title")->where(array("id"=>$id));
            $sql->prepareStatementForSqlObject($delete)->execute();
            $values = array("publication_id"=>$id);
            for($c=0; $c<count($titles); $c++)
            {
                $values["title"] = $titles[$c];
                $insert = $sql->insert("publication_title")->values($values);
                $sql->prepareStatementForSqlObject($insert)->execute();
            }

            $conn->commit();

        } catch(\Exception $e)
        {
            $conn->rollback();
        }

        return $this->pubSelect($args);
    }

    public function pubInsert($args) {

        $data = $args["data"];
        $parentId = isset($data["parentId"]) ? $data["parentId"] : 0;
        $year = isset($data["year"]) ? $data["year"] : 0;
        $cobiss = isset($data["cobiss"]) ? $data["cobiss"] : 0;
        $issn = isset($data["issn"]) ? $data["issn"] : 0;
        $originalId = isset($data["originalId"]) ? $data["originalId"] : 0;

        $authors = isset($data["authorName"]) ? $data["authorName"] : array();
        $titles = isset($data["title"]) ? $data["title"] : array();

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $conn = $adapter->getDriver()->getConnection();

        $conn->beginTransaction();
        try
        {
            $sql = new Sql($adapter);
            $values = array(
                "parent_id" => $parentId,
                "year" => $year,
                "cobiss" => $cobiss,
                "issn" => $issn,
                "original_id" => $originalId
            );
            $insert = $sql->insert("publication")->values($values);
            $sql->prepareStatementForSqlObject($insert)->execute();

            $publication_id = $conn->getLastGeneratedValue();

            $values = array("publication_id"=>$publication_id);
            for($c=0; $c<count($authors); $c++)
            {
                $values["author"] = $authors[$c];
                $insert = $sql->insert("publication_author")->values($values);
                $sql->prepareStatementForSqlObject($insert)->execute();
            }

            $values = array("publication_id"=>$publication_id);
            for($c=0; $c<count($titles); $c++)
            {
                $values["title"] = $titles[$c];
                $insert = $sql->insert("publication_title")->values($values);
                $sql->prepareStatementForSqlObject($insert)->execute();
            }

            $conn->commit();

        } catch(\Exception $e)
        {
            $conn->rollback();
        }

        return $this->pubSelect(array("id"=>$publication_id));
    }

}
