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

        $creatorTypes = array();
        $codes = DbUtil::selectFrom('codes_pub_creator');
        foreach ($codes as $code) $creatorTypes[$code["value"]] = $code["code_id"];

        $idnoTypes = array();
        $codes = DbUtil::selectFrom('codes_pub_idno');
        foreach ($codes as $code) $idnoTypes[$code["value"]] = $code["code_id"];

        $sourceTypes = array();
        $codes = DbUtil::selectFrom('codes_pub_source');
        foreach ($codes as $code) $sourceTypes[$code["value"]] = $code["code_id"];


        $entityCount = 0;
        $testEntity = null;
        $errors = array();

        foreach($xml->entities->entity as $entity){

            $pubId = (int)$entity->id;


            try {

                /*
                DbUtil::deleteFrom('publication', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_addidno', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_addtitle', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_creator', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_doubles_selected', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_edition', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_idno', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_issue', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_note', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_online', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_page', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_place', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_project_link', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_publisher', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_source', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_strng', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_title', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_volume', array('pub_id' => $pubId));
                DbUtil::deleteFrom('publication_year', array('pub_id' => $pubId));
                */

                $pubData = array(
                    "pub_id" => $pubId,
                    "parent_id" => Util::getXmlFieldValue($entity, "parent", false),
                    //"year" => Util::getXmlFieldValue($entity, "date", false),
                    //"cobiss" => Util::getXmlFieldValue($entity, "idno", false, "[@idnoType='cobiss']"),
                    //"issn" => Util::getXmlFieldValue($entity, "idno", false, "[@idnoType='issn']"),
                );
                DbUtil::insertInto("publication", $pubData);


                $title = Util::getXmlFieldValue($entity, "title", true);
                foreach ($title as $idx => $val)
                    DbUtil::insertInto("publication_title", array("pub_id" => $pubId, "idx" => $idx+1, "title" => $val));


                $idx = 1;
                foreach ($creatorTypes as $value => $codeId) {
                    $creator = Util::getXmlFieldValue($entity, "creator", true, "[@creatorType='".$value."']");
                    foreach ($creator as $idx_ => $val){
                        DbUtil::insertInto("publication_creator", array("pub_id" => $pubId, "idx" => $idx, "creator" => $val, "code_id" => $codeId));
                        $idx++;
                    }
                }

                $idx = 1;
                foreach ($idnoTypes as $value => $codeId) {
                    $idno = Util::getXmlFieldValue($entity, "idno", true, "[@idnoType='".$value."']");
                    foreach ($idno as $idx_ => $val) {
                        DbUtil::insertInto("publication_idno", array("pub_id" => $pubId, "idx" => $idx, "idno" => $val, "code_id" => $codeId));
                        $idx++;
                    }
                }


                $year = Util::getXmlFieldValue($entity, "date", true);
                foreach ($year as $idx => $val)
                    DbUtil::insertInto("publication_year", array("pub_id" => $pubId, "idx" => $idx+1, "year" => $val));


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
