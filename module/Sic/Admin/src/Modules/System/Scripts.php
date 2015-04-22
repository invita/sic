<?php
namespace Sic\Admin\Modules\System;

use Sic\Admin\Models\IO\Console;
use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;

class Scripts
{
    public function importEntities($args)
    {
        $entityCount = 0;
        $relationsCount = 0;
        $sameAsCount = 0;

        // Load File
        $fileName = Util::getArg($args, 'fileName', null);
        if (!$fileName) {return array('status' => false, 'alert' => 'No fileName selected!'); }

        try {
            $contents = file_get_contents(Util::getUploadPath().$fileName);
        }
        catch (Exception $e) {
            return array(
                "status" => false,
                "error" => "Error reading file ".$fileName,
                "message" => $e->getMessage()
            );
        }

        // Load XML
        $xml = new \SimpleXMLElement($contents);
        if ($xml === false) {
            $errorMessage = "";
            foreach(libxml_get_errors() as $error) {
                if ($errorMessage) $errorMessage .= ", ";
                $errorMessage .= $error->message;
            }
            return array(
                "status" => false,
                "error" => "Error parsing XML",
                "message" => $errorMessage
            );
        }


        $entityCount = 0;
        $testEntity = null;
        $errors = array();

        foreach($xml->entities->entity as $entity){

            $pubId = (int)$entity->id;


            try {

                DbUtil::deleteFrom('publication', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_title', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_creator', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_place', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_publisher', array('pub_id' => $pubId));


                $pubData = array(
                    "pub_id" => $pubId,
                    "parent_id" => Util::getXmlFieldValue($entity, "parent", false),
                    "year" => Util::getXmlFieldValue($entity, "date", false),
                    "cobiss" => Util::getXmlFieldValue($entity, "idno", false, "[@idnoType='cobiss']"),
                    "issn" => Util::getXmlFieldValue($entity, "idno", false, "[@idnoType='issn']"),
                );
                DbUtil::insertInto("publication", $pubData);


                $title = Util::getXmlFieldValue($entity, "title", true);
                foreach ($title as $idx => $val)
                    DbUtil::insertInto("publication_title", array("pub_id" => $pubId, "idx" => $idx+1, "title" => $val));


                $creator = Util::getXmlFieldValue($entity, "creator", true, "[@creatorType='author']");
                foreach ($creator as $idx => $val)
                    DbUtil::insertInto("publication_creator", array("pub_id" => $pubId, "idx" => $idx+1, "creator" => $val));


                $place = Util::getXmlFieldValue($entity, "pubPlace", true);
                foreach ($place as $idx => $val)
                    DbUtil::insertInto("publication_place", array("pub_id" => $pubId, "idx" => $idx+1, "place" => $val));


                $publisher = Util::getXmlFieldValue($entity, "publisher", true);
                foreach ($publisher as $idx => $val)
                    DbUtil::insertInto("publication_publisher", array("pub_id" => $pubId, "idx" => $idx+1, "publisher" => $val));

            }
            catch (Exception $e) {
                $errors[] = $e->getMessage();
            }

            // Misc
            /*
            $page = Util::getXmlFieldValue($entity, "page", false);
            $addTitle = Util::getXmlFieldValue($entity, "addTitle", false);
            $addIdno = Util::getXmlFieldValue($entity, "addIdno", false);
            */

            $entityCount++;
        }

        $result = array(
            "status" => true,
            "entityCount" => $entityCount
        );
        if (count($errors)) $result["errors"] = $errors;

        return $result;
    }


}
