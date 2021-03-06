<?php
namespace Sic\Admin\Modules\Project;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;

class ProjectEdit
{
    public function projSelect($args)
    {

        $proj_id = Util::getArg($args, 'proj_id', 0);

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select()->from('project')->where(array('proj_id' => $proj_id));
        $statement = $sql->prepareStatementForSqlObject($select);
        $results = $statement->execute();
        $row = $results->current();

        $row['created_by_username'] = DbUtil::selectOne('user', 'username', array('id' => $row['created_by']));

        return array("data" => $row);
    }

    public function projUpdate($args)
    {

        $proj_id = Util::getArg($args, 'proj_id', null);
        if (!$proj_id) return $this->projInsert($args);

        $data = Util::getArg($args, 'data', null);
        unset($data['created_by_username']);

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $update = $sql->update()->table('project')->set($data)->where(array('proj_id' => $proj_id));
        $statement = $sql->prepareStatementForSqlObject($update);
        $result = $statement->execute();

        DbUtil::touchProject($proj_id);

        return $this->projSelect($args);
    }

    public function projInsert($args)
    {

        $data = Util::getArg($args, 'data', null);
        unset($data['created_by_username']);

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);

        $data['created_date'] = new Expression('NOW()');
        $data['created_by'] = Util::getUserId();

        $insert = $sql->insert()->into('project')->values($data);
        $statement = $sql->prepareStatementForSqlObject($insert);
        $result = $statement->execute();
        $args['proj_id'] = $result->getGeneratedValue();

        DbUtil::touchProject($args['proj_id']);

        return $this->projSelect(array("proj_id" => $args['proj_id']));
    }

    public function loadXml($args)
    {
        $proj_id = Util::getArg($args, 'proj_id', 0);
        $fileName = Util::getArg($args, 'fileName', null);

        if (!$proj_id) { return array('status' => false, 'alert' => 'Save the project first!'); }
        if (!$fileName) { return array('status' => false, 'alert' => 'No fileName selected!'); }

        $contents = file_get_contents(Util::getUploadPath().$fileName);
        $xml = new \SimpleXMLElement($contents);

        $lines = array();
        $idx = 1;
        foreach($xml->entity as $entity){
            $lines[] = array(
                "proj_id" => $proj_id,
                "idx" => $idx,
                "xml" => $entity->asXML()
            );
            /*
            $lines[] = array(
                "idx" => $idx,
                "title" => Util::getXmlFieldValue($entity, "title", false),
                "creator" => Util::getXmlFieldValue($entity, "creator", false, "[@creatorType='author']"),
                "year" => Util::getXmlFieldValue($entity, "date", false),
                "cobiss" => Util::getXmlFieldValue($entity, "idno", false, "[@idnoType='cobiss']"),
                "issn" => Util::getXmlFieldValue($entity, "idno", false, "[@idnoType='issn']"),
            );
            */
            $idx++;
        }

        DbUtil::deleteFrom('project_line', array('proj_id' => $proj_id));
        DbUtil::deleteFrom('publication_project_link', array('proj_id' => $proj_id));

        foreach ($lines as $line) {
            DbUtil::insertInto('project_line', $line);
        }

        try {
            $rowCount = DbUtil::selectOne('project_line', new Expression('COUNT(*)'), array('proj_id' => $proj_id));

        } catch (Exception $e) {
            echo DbUtil::$lastSqlSelect->getSqlString();
        }

        DbUtil::touchProject($proj_id);

        return array('status' => true, 'count' => $rowCount);
    }
}
