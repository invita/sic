<?php
namespace Sic\Admin\Modules\System;

use Sic\Admin\Models\IO\Console;
use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;

class ExportXml
{
    public static function exportAll() {

        $NL = "\n";
        $tab = "    "; $tab2 = $tab.$tab; $tab3 = $tab2.$tab; $tab4 = $tab2.$tab2;

        $result = '<?xml version="1.0" encoding="UTF-8"?>'.$NL;
        $result .= '<sic exportDate="'.date("Y-m-d").'">'.$NL;

        $publications = DbUtil::selectFrom('publication');
        $codesObj = new Codes();
        $codesMap = $codesObj->getCodesMap();

        $result .= $tab.'<entities>'.$NL;
        foreach ($publications as $publication) {
            $pubId = $publication['pub_id'];
            $result .= $tab2.'<entity>'.$NL;

            // Table publication
            foreach ($publication as $fieldName => $fieldVal)
                $result .= $tab3.'<'.$fieldName.'>'.$fieldVal.'</'.$fieldName.'>'.$NL;

            // Table publication_*
            foreach (DbUtil::$pubTableNames as $tableName) {
                $tableData = DbUtil::selectFrom("publication_".$tableName, null, array("pub_id" => $pubId));
                foreach ($tableData as $tableRow) {
                    $fieldName = $tableName;
                    $fieldVal = Util::getArg($tableRow, $fieldName, "");

                    if (!$fieldVal) continue;

                    $attrib = "";
                    if (isset($tableRow["code_id"])) {
                        $codeName = "pub".ucfirst($fieldName);
                        if (isset($codesMap[$codeName])) {
                            $attribName = $fieldName."Type";
                            $attribValue = Util::getArg($codesMap[$codeName], $tableRow["code_id"], "");
                            $attrib = ' '.$attribName.'="'.$attribValue.'"';
                        }
                    }

                    $result .= $tab3.'<'.$fieldName.$attrib.'>'.$fieldVal.'</'.$fieldName.'>'.$NL;
                }
            }

            // Citations
            $result .= $tab3.'<citations>'.$NL;
            $quotes = DbUtil::selectFrom("quote", null, array("pub_id" => $pubId, "parent_quote_id" => 0));
            foreach ($quotes as $quote) {

                $quoteId = $quote["quote_id"];
                $quote1Attr = ' quoteId="'.$quoteId.'" onPage="'.$quote["on_page"].'" citedEntity="'.$quote["quoted_pub_id"].'" citedPage="'.$quote["cited_page"].'"';

                $subquotes = DbUtil::selectFrom("quote", null, array("pub_id" => $pubId, "parent_quote_id" => $quoteId));

                if ($subquotes && count($subquotes)) {
                    $result .= $tab4.'<citation'.$quote1Attr.'>'.$NL;
                    foreach ($subquotes as $subquote) {
                        $quote2Attr = ' quoteId="'.$subquote["quote_id"].'" onPage="'.$subquote["on_page"].'" citedEntity="'.$subquote["quoted_pub_id"].'" citedPage="'.$subquote["cited_page"].'"';
                        $result .= $tab4.$tab.'<citation'.$quote2Attr.'></citation>'.$NL;
                    }
                    $result .= $tab4.'</citation>'.$NL;
                } else {
                    $result .= $tab4.'<citation'.$quote1Attr.'></citation>'.$NL;
                }

            }
            $result .= $tab3.'</citations>'.$NL;

            $result .= $tab2.'</entity>'.$NL;
        }
        $result .= $tab.'</entities>'.$NL;

        $result .= $tab.'<codes>'.$NL;
        foreach ($codesMap as $codeName => $codeMap) {
            $result .= $tab2.'<codeMap codeName="'.$codeName.'">'.$NL;
            foreach ($codeMap as $codeId=>$codeVal) {
                $result .= $tab3.'<codeValue codeId="'.$codeId.'">'.$codeVal.'</codeValue>'.$NL;
            }
            $result .= $tab2.'</codeMap>'.$NL;
        }
        $result .= $tab.'</codes>'.$NL;

        $result .= '</sic>'.$NL;

        $userId = Util::getUserId();
        $fileName = "sic.".$userId.".export.all.xml";
        $filePath = realpath(__DIR__."/../../../../../../data/download");
        file_put_contents($filePath."/".$fileName, $result);

        return array(
            "status" => true,
            "file" => $filePath."/".$fileName,
            "link" => "/download?fileName=".$fileName
        );
    }
}
