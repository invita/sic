<?php
namespace Sic\Admin\Modules\System;

use Sic\Admin\Models\Util;

require_once(realpath(__DIR__."/../../../../../../library/Solr/Solr.php"));

class SolrControl
{
    public function reindex($args) {

        $dataConfigFile = 'data-config.xml';
        $dataConfigFullPath = Util::getSolrConfigPath($dataConfigFile).$dataConfigFile;
        $dataConfigContent = file_get_contents($dataConfigFullPath);

        $solrQueryParams = array(
            "wt" => "json",
            "command" => "full-import",
            "clean" => true,
            "commit" => true,
            "verbose" => false,
            "optimize" => false,
            "dataConfig" => $dataConfigContent,
        );

        $solr = new \Solr();
        $solr->setAction("/collection1/dataimport");
        $solr->setQueryParams($solrQueryParams);
        $solr->run();


        $solrStatus = new \Solr();
        $solrStatus->setAction("/collection1/dataimport");
        $solrStatus->setQueryParams(array(
            "command" => "status",
            "wt" => "json"
        ));
        $solrStatus->run();
        $response = $solrStatus->toArray();


        $result = array(
            "status" => true,
            "response" => $response,
            "message" => "Reindex in progress..."
        );

        return $result;
    }
}
