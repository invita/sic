<?php
namespace Sic\Admin\Modules\System;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Update;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;
use Zend\Db\Adapter\Driver\ResultInterface;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Sic\Admin\Modules\Pub\PubEdit;

class SolrConfig
{
    public function loadConfig($args)
    {
        $fileName = Util::getArg($args, 'fileName', null);
        $fileContent = "";

        if ($fileName) {
            $path = Util::getSolrConfigPath($fileName);
            if ($path !== false && file_exists($path.$fileName))
                $fileContent = file_get_contents($path.$fileName);
        }

        $result = array(
            "fileName" => $fileName,
            "fileContent" => $fileContent,
            "status" => true
        );

        return $result;
    }

    public function saveConfig($args)
    {
        $fileName = Util::getArg($args, 'fileName', null);
        $fileContent = Util::getArg($args, 'fileContent', null);

        if ($fileName) {
            $path = Util::getSolrConfigPath($fileName);
            if ($path !== false)
                file_put_contents($path.$fileName, $fileContent);
        }

        $result = array("status" => true);
        return $result;
    }

    public function getFiles($args) {
        $solrConfigPaths = Util::get('solrConfigPaths');
        $solrFiles = array_keys($solrConfigPaths);

        $result = array(
            "fileList" => $solrFiles,
            "status" => true
        );
        return $result;
    }
}
