<?php
namespace Sic\Admin\Modules\System;

use Sic\Admin\Models\IO\Console;
use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Sic\Admin\Models\Util;

class Scripts
{
    public function importEntities($args)
    {
        $entityCount = 0;
        $relationsCount = 0;
        $sameAsCount = 0;

        $fileName = Util::getArg($args, 'fileName', null);
        if (!$fileName) {return array('status' => false, 'alert' => 'No fileName selected!'); }

        $contents = file_get_contents(Util::getUploadPath().$fileName);
        $xml = new \SimpleXMLElement($contents);

        $entities = array();
        $idx = 1;
        foreach($xml->entities->entity as $entity){
            $entities[] = array(
                "id" => $entity->id,
                "title" => trim((string)$entity->title),
                "author" => trim((string)$entity->author),
                "publisher" => intval(trim((string)$entity->publisher)),
            );
            $idx++;
        }

        $entityCount = count($entities);

        $result = array(
            "status" => true,
            "entityCount" => $entityCount,
            "relationsCount" => $relationsCount,
            "sameAsCount" => $sameAsCount,
        );
        return $result;
    }
}
