<?php
namespace Sic\Admin\Modules\Project;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Sic\Admin\Models\Util;

class ProjectEdit {
    public function projSelect($args) {

        $id = Util::getArg($args, 'id', 0);

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select()->from('project')->where(array('id' => $id));
        $statement = $sql->prepareStatementForSqlObject($select);
        $results = $statement->execute();
        $row = $results->current();

        return array("data" => $row);
    }

    public function projUpdate($args) {

        $id = Util::getArg($args, 'id', null);
        if (!$id) return $this->projInsert($args);

        $data = Util::getArg($args, 'data', null);

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $update = $sql->update()->table('project')->set($data)->where(array('id' => $id));
        $statement = $sql->prepareStatementForSqlObject($update);
        $result = $statement->execute();

        return $this->projSelect($args);
    }

    public function projInsert($args) {

        $data = Util::getArg($args, 'data', null);
        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);

        $select = $sql->select()->from('project')->columns(array("maxId" => new \Zend\Db\Sql\Expression('MAX(id)')));
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        if ($result->current())
            $data['id'] = ($result->current()) ? $result->current()['maxId'] +1 : 1;


        //print_r($data); die();
        $insert = $sql->insert()->into('project')->values($data);
        $statement = $sql->prepareStatementForSqlObject($insert);
        $result = $statement->execute();
        $args['id'] = $result->getGeneratedValue();

        return $this->projSelect(array("id"=>$args['id']));
    }

}
