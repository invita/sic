<?php
namespace Sic\Admin\Modules\Project;

use Sic\Admin\Models\DbUtil;
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
        $result = $statement->execute()->current();

        if ($result) {
            $data['id'] = ($result) ? $result['maxId'] +1 : 1;
        }


        //print_r($data); die();

        $data['date_created'] = new \Zend\Db\Sql\Expression('CURDATE()');

        $insert = $sql->insert()->into('project')->values($data);
        $statement = $sql->prepareStatementForSqlObject($insert);
        $result = $statement->execute();
        $args['id'] = $result->getGeneratedValue();

        return $this->projSelect(array("id"=>$args['id']));
    }

    public function loadXml($args)
    {
        $projectId = Util::getArg($args, 'id', null);
        $fileName = Util::getArg($args, 'fileName', null);

        if (!$projectId) {echo json_encode(array('alert' => 'No projectId!')); return; }
        if (!$fileName) {echo json_encode(array('alert' => 'No fileName!')); return; }

        $contents = file_get_contents(Util::getUploadPath().$fileName);
        $xml = new \SimpleXMLElement($contents);

        $lines = array();
        foreach($xml->line as $line){
            $lines[] = array(
                "title" => trim((string)$line->title),
                "author" => trim((string)$line->author),
                "cobiss" => trim((string)$line->cobiss),
                "issn" => trim((string)$line->issn),
            );
        }

        DbUtil::deleteFrom('project_tmplines', array('project_id' => $projectId));

        foreach ($lines as $line) {
            $line['project_id'] = $projectId;
            DbUtil::insertInto('project_tmplines', $line);
        }

        return array('status' => true);
    }
}
