<?php
namespace Sic\Admin\Models;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Update;
use Zend\Db\Sql\Where;
use Zend\Db\Sql\Predicate\Operator;
use Zend\Db\Adapter\Driver\ResultInterface;
use Sic\Admin\Models\Util;

abstract class SicModuleAbs
{

//<editor-fold desc="*** DataTable ***">

    //<editor-fold desc="DataTable Select">
    public function defineSqlSelect($args, Select $select) {

    }

    public function defineSqlSelectLimit($args, Select $select) {
        $sortField = Util::getArg($args, 'sortField', null);
        $sortOrder = Util::getArg($args, 'sortOrder', 'asc');
        $pageStart = intval(Util::getArg($args, 'pageStart', 0));
        $pageCount = intval(Util::getArg($args, 'pageCount', 5));

        if ($sortField) $select->order($sortField." ".$sortOrder);
        $select->offset($pageStart);
        $select->limit($pageCount);
    }

    public function defineSqlSelectFilter($args, Select $select) {
        $filter = Util::getArg($args, 'filter', array());
        $filterWhere = DbUtil::prepareSqlFilter($filter);
        if (count($filterWhere->getPredicates()))
            $select->where->addPredicate($filterWhere);
    }

    public function defineDataTableResponseData($args, ResultInterface $result) {
        $responseData = array();
        foreach($result as $row) {
            $responseData[] = $row;
        }
        return $responseData;
    }

    public function defineRowCount($args, Select $select) {
        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $statement = $sql->prepareStatementForSqlObject($select);
        $sqlResult = $statement->execute();
        return $sqlResult->getAffectedRows();
    }

    public function dataTableSelect($args) {

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select();

        $this->defineSqlSelect($args, $select);
        $this->defineSqlSelectFilter($args, $select);

        $rowCount = $this->defineRowCount($args, clone($select));

        $this->defineSqlSelectLimit($args, $select);

        $statement = $sql->prepareStatementForSqlObject($select);
        //echo $statement->getSql(); die();
        $sqlResult = $statement->execute();

        $responseData = $this->defineDataTableResponseData($args, $sqlResult);

        return array(
            'data' => $responseData,
            'rowCount' => $rowCount
            //'sql' => $statement->getSql()
        );
    }

    //</editor-fold>

    //<editor-fold desc="DataTable Delete">
    public function defineSqlDelete($args, Delete $delete) {

    }

    public function dataTableDelete($args) {

        $data = Util::getArg($args, 'data', null);
        $rowsAffected = 0;

        if ($data) {
            $adapter = GlobalAdapterFeature::getStaticAdapter();
            $sql = new Sql($adapter);
            $delete = $sql->delete();
            $deleteArray = $this->defineSqlDelete($args, $delete);
            if ($deleteArray !== false) {
                if (!is_array($deleteArray)) {
                    $deleteArray = array($delete);
                }

                $conn = $adapter->getDriver()->getConnection();
                $conn->beginTransaction();
                foreach ($deleteArray as $deleteSql) {
                    $statement = $sql->prepareStatementForSqlObject($deleteSql);
                    $sqlResult = $statement->execute();
                    $rowsAffected = $rowsAffected + $sqlResult->getAffectedRows();
                }
                $conn->commit();
            }
        }

        $result = $this->dataTableSelect($args);
        $result['rowsAffected'] = $rowsAffected;
        return $result;
    }
    //</editor-fold>

    //<editor-fold desc="DataTable UpdateRow">
    public function defineSqlUpdateRow($args, Update $update) {

    }

    public function dataTableUpdateRow($args) {

        $data = Util::getArg($args, 'data', null);
        $rowsAffected = 0;

        if ($data) {
            $adapter = GlobalAdapterFeature::getStaticAdapter();
            $sql = new Sql($adapter);
            $update = $sql->update();
            $this->defineSqlUpdateRow($args, $update);
            $conn = $adapter->getDriver()->getConnection();
            $conn->beginTransaction();
            $statement = $sql->prepareStatementForSqlObject($update);
            $sqlResult = $statement->execute();
            $rowsAffected = $sqlResult->getAffectedRows();
            $conn->commit();
        }

        $result = $this->dataTableSelect($args);
        $result['rowsAffected'] = $rowsAffected;
        return $result;
    }
    //</editor-fold>


    //<editor-fold desc="DataTable Export">

    public function prepareExportData($args) {
        $selectResp = $this->dataTableSelect($args);
        $data = Util::getArg($selectResp, "data", array());
        foreach($data as $idx => $line) {
            foreach($line as $fieldName => $fieldValue) {
                if (substr($fieldName, 0, 1) == '_')
                    unset($line[$fieldName]);
                else if (is_array($fieldValue))
                    $line[$fieldName] = join(',', $fieldValue);
            }
            $data[$idx] = $line;
        }
        return $data;
    }

    public function dataTableExportXls($args) {

        $data = $this->prepareExportData($args);
        if (!$data) {
            return array(
                "status" => false,
                "alert" => "No data in dataTable"
            );
        }

        $headerFields = array_keys($data[0]);
        $filePath = Util::getDownloadPath();
        $userId = Util::getUserId();
        $moduleName = Util::getArg($args, 'moduleName', 'dataTable');
        $title = ucwords(str_replace('/', ' - ', $moduleName));
        $fileName = "sic.".$userId.".export.".strtolower(str_replace('/', '.', $moduleName)).".xlsx";

        include __DIR__."/../../../../../library/PHPExcel/PHPExcel.php";

        $errReporting = error_reporting();
        error_reporting(0);

        $objPHPExcel = new \PHPExcel();
        $objPHPExcel->getProperties()->setCreator("sic");
        $objPHPExcel->getProperties()->setLastModifiedBy("sic");
        $objPHPExcel->getProperties()->setTitle($title);
        //$objPHPExcel->getProperties()->setSubject("Data export");
        //$objPHPExcel->getProperties()->setDescription("SAMPLE1");
        $worksheet = $objPHPExcel->getActiveSheet();

        $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, "Excel2007");

        // Title Row
        $worksheet->getStyle('A1')->getFont()->setBold(true);
        $worksheet->getStyle('A1')->getFont()->setColor(new \PHPExcel_Style_Color('FF3366CC'));
        $worksheet->setCellValue('A1', $title);
        $worksheet->mergeCells("A1:".(chr(64 + min(count($headerFields), 26)))."1");

        // Header Row
        $worksheet->fromArray($headerFields, NULL, 'A2' );

        // Data Rows
        $worksheet->fromArray($data, NULL, 'A3' );

        // Write
        $objWriter->save($filePath."/".$fileName);

        error_reporting($errReporting);

        return array(
            "status" => true,
            "file" => $filePath."/".$fileName,
            "link" => "/download?fileName=".$fileName
        );
    }

    public function dataTableExportCsv($args) {

        $data = $this->prepareExportData($args);
        if (!$data) {
            return array(
                "status" => false,
                "alert" => "No data in dataTable"
            );
        }

        $headerFields = array_keys($data[0]);
        $filePath = Util::getDownloadPath();
        $userId = Util::getUserId();
        $moduleName = Util::getArg($args, 'moduleName', 'dataTable');
        $fileName = "sic.".$userId.".export.".strtolower(str_replace('/', '.', $moduleName)).".csv";
        $fieldSep = ";";
        $lineSep = "\n";

        $csvContent = "";

        // Header Row
        foreach($headerFields as $headerField) {
            if ($csvContent) $csvContent .= $fieldSep;
            $csvContent .= $headerField;
        }
        $csvContent .= $lineSep;

        // Data Rows
        foreach($data as $line) {
            $lineStr = '';
            foreach ($line as $fieldName => $fieldValue) {
                if ($lineStr !== '') $lineStr .= $fieldSep;
                $lineStr .= $fieldValue;
            }
            $csvContent .= $lineStr.$lineSep;
        }

        // Prepend utf-8 Byte Order Mark characters
        $bom = chr(0xEF).chr(0xBB).chr(0xBF);
        $csvContent = $bom.$csvContent;

        file_put_contents($filePath."/".$fileName, $csvContent);

        return array(
            "status" => true,
            "file" => $filePath."/".$fileName,
            "link" => "/download?fileName=".$fileName
        );
    }

    //</editor-fold>

//</editor-fold>

//<editor-fold desc="*** Form ***">

//</editor-fold>

}