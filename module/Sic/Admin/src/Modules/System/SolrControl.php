<?php
namespace Sic\Admin\Modules\System;

use Sic\Admin\Models\Util;

require_once(realpath(__DIR__."/../../../../../../library/Solr/Solr.php"));

class SolrControl
{
    public function reindex($args) {

        $command = Util::getArg($args, "command", "full-import");
        $rows = Util::getArg($args, "rows", null);
        $waitTime = Util::getArg($args, "waitTime", null);

        $dataConfigFile = 'data-config.xml';
        $dataConfigFullPath = Util::getSolrConfigPath($dataConfigFile).$dataConfigFile;
        $dataConfigContent = file_get_contents($dataConfigFullPath);

        $solrQueryParams = array(
            "wt" => "json",
            "command" => $command,
            "clean" => false,
            "commit" => true,
            "verbose" => false,
            "optimize" => false,
            "indent" => false,
            //"dataConfig" => $dataConfigContent,
        );

        if ($rows)
            $solrQueryParams["rows"] = $rows;


        $solr = new \Solr();
        $solr->setAction("/collection1/dataimport");
        $solr->setQueryParams($solrQueryParams);
        $solr->run();
        $fullImportResp = json_decode($solr->getLastRawData()->body, true);

        if (is_numeric($waitTime))
            usleep($waitTime * 1000);

        $solrStatus = new \Solr();
        $solrStatus->setAction("/collection1/dataimport");
        $solrStatus->setQueryParams(array(
            "command" => "status",
            "indent" => "false",
            "wt" => "json",
            "_" => microtime()
        ));
        $solrStatus->run();
        $statusResp = json_decode($solrStatus->getLastRawData()->body, true);

        $result = array(
            "status" => true,
            "message" => "Reindex in progress...",
            "status" => $statusResp["status"],
            "statusMessage" => $statusResp["statusMessages"],
        );

        return $result;
    }
}
