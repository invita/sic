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
        $response = $solr->toArray();

        $result = array(
            "status" => true,
            "response" => $response,
            "queryParams" => $solrQueryParams
        );

        return $result;
    }
}
