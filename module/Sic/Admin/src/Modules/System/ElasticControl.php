<?php
namespace Sic\Admin\Modules\System;

use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Sic\Admin\Models\Elastic\ElasticHelper;

class ElasticControl
{
    public static $indexBulkDocCount = 100;
    public static $NL = "<br/>\n";

    private $totalTime;

    public function deleteIndices($args)
    {
        $url = Util::getElasticUrl() .ElasticHelper::$entityIndexName;
        $context  = stream_context_create(array('http' => array(
            'method'  => 'DELETE',
            'content' => ""
        )));


        ob_start();
        $resp = file_get_contents($url, false, $context);
        $ob = ob_get_clean();

        return $resp.$ob;
    }

    private function configureIndex($args) {
        $config = <<<HERE
    {
        "settings" : {

            "number_of_shards": 1,
            "number_of_replicas": 0,

            "index" : {
                "refresh_interval" : "1s",
                "analysis" : {
                    "filter" : {
                        "my_ngram_filter" : {
                            "type" : "ngram",
                            "min_gram" : 3,
                            "max_gram" : 6,
                            "minimum_should_match": 3
                        }
                    },
                    "analyzer" : {
                        "my_ngram_analyzer" : {
                            "type" : "custom",
                            "tokenizer" : "standard",
                            "filter"    : ["lowercase", "asciifolding", "my_ngram_filter"]
                        }
                    }
                }
            }
        },
        "mappings": {
            "entity": {
                "properties": {
                    "addidno": {
                        "type": "string",
                        "analyzer": "my_ngram_analyzer",
                        "boost": 5
                    },
                    "addtitle": {
                        "type": "string",
                        "analyzer": "my_ngram_analyzer",
                        "boost": 5,
                        "copy_to": "quick_search"
                    },
                    "creator": {
                        "type": "string",
                        "analyzer": "my_ngram_analyzer",
                        "boost": 5,
                        "copy_to": "quick_search"
                    },
                    "edition": {
                        "type": "string",
                        "analyzer": "my_ngram_analyzer",
                        "boost": 5
                    },
                    "idno": {
                        "type": "string",
                        "analyzer": "my_ngram_analyzer",
                        "boost": 10
                    },
                    "issue": {
                        "type": "string",
                        "analyzer": "my_ngram_analyzer",
                        "boost": 5
                    },
                    "note": {
                        "type": "string",
                        "analyzer": "my_ngram_analyzer",
                        "boost": 5,
                        "copy_to": "quick_search"
                    },
                    "online": {
                        "type": "string",
                        "analyzer": "my_ngram_analyzer",
                        "boost": 5
                    },
                    "page": {
                        "type": "string",
                        "analyzer": "my_ngram_analyzer",
                        "boost": 5
                    },
                    "place": {
                        "type": "string",
                        "analyzer": "my_ngram_analyzer",
                        "boost": 5
                    },
                    "publisher": {
                        "type": "string",
                        "analyzer": "my_ngram_analyzer",
                        "boost": 5
                    },
                    "source": {
                        "type": "string",
                        "analyzer": "my_ngram_analyzer",
                        "boost": 5
                    },
                    "strng": {
                        "type": "string",
                        "analyzer": "my_ngram_analyzer",
                        "boost": 5
                    },
                    "title": {
                        "type": "string",
                        "analyzer": "my_ngram_analyzer",
                        "boost": 20,
                        "copy_to": "quick_search"
                    },
                    "volume": {
                        "type": "string",
                        "analyzer": "my_ngram_analyzer",
                        "boost": 5
                    },
                    "year": {
                        "type": "string",
                        "boost": 10
                    },
                    "quick_search": {
                        "analyzer": "my_ngram_analyzer",
                        "type": "string"
                    }
                }
            }
        }
    }
HERE;

        $d = json_decode($config, true);
        $url = Util::getElasticUrl().ElasticHelper::$entityIndexName;
        $context  = stream_context_create(array('http' => array(
            'method'  => 'PUT',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => json_encode($d)
        )));
        $resp = file_get_contents($url, false, $context);

        if (!$resp)
            echo "Failed to put config\n";

        return $resp;
    }

    private function bulkReindex($postData) {
        $url = Util::getElasticUrl()."_bulk";
        $context  = stream_context_create(array('http' => array(
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $postData
        )));
        //print_r($postData);
        //echo $url;
        $message = file_get_contents($url, false, $context)."\n";
        return $message;
    }

    public function reindex($args)
    {
        set_time_limit(86400); // Limit time: one day

        $startT1 = microtime(true);

        $message = "";

        $message .= "Deleting index '".ElasticHelper::$entityIndexName."' ... ". $this->deleteIndices(null) .self::$NL;
        $message .= "Reconfiguring index settings ... " . $this->configureIndex(null) .self::$NL;

        $docCount = 0;
        $bulkData = "";
        $pubs = DbUtil::selectFrom('view_publication_list');
        $this->totalTime = 0;

        $bulkRequest = function($bulkData) {
            $r = "";
            $startT = microtime(true);
            $bulkResult = json_decode($this->bulkReindex($bulkData), true);

            $t = microtime(true) -$startT;
            $r .= "Indexing ".self::$indexBulkDocCount." documents ... ".
                "took:". $bulkResult["took"].", ".
                "errors: ".($bulkResult["errors"] ? $bulkResult["errors"] : "false").", ".
                "measuredTime: ".number_format($t*1000, 2)." ms" .self::$NL;
            $this->totalTime += $t;
            return $r;
        };

        //print_r($pubs);
        foreach ($pubs as $pub) {

            // { "index" : { "_index" : "test", "_type" : "type1", "_id" : "1" } }
            $indexCmd = array(
                "index" => array(
                    "_index" => ElasticHelper::$entityIndexName,
                    "_type" => "entity",
                    "_id" => $pub["pub_id"]
                )
            );
            $indexCmdStr = json_encode($indexCmd);

            // { "field1" : "value1" }
            //$pub = new \Sic\Admin\Modules\Pub\PubEdit();
            //$pubData = $pub->pubSelect(array("pub_id" => $pub["pub_id"]));
            foreach ($pub as $key => $val)
                $pub[$key] = explode("||", $val);
                //$pub[$key] = str_replace("||", " ", $val);

            $pubDataStr = json_encode($pub);
            //echo $pubDataStr."\n";

            $bulkData .= $indexCmdStr."\n".$pubDataStr."\n";

            $docCount++;
            if ($docCount % self::$indexBulkDocCount == 0) {
                $message .= $bulkRequest($bulkData);
                $bulkData = "";
            }

            // Faster debug, first few only
            //if ($docCount >= 500) break;
        }

        if ($bulkData) {
            $message .= $bulkRequest($bulkData);
            $bulkData = "";
        }

        $totalTime2 = microtime(true) - $startT1;

        $result = array(
            "status" => true,
            "message" => "Indexing complete." .self::$NL.
                "Document count: <b>".$docCount."</b>" .self::$NL.
                "Sum(measuredTime): ".number_format($this->totalTime*1000, 2)." ms" .self::$NL.
                "Total process time: ".number_format($totalTime2*1000, 2)." ms" .self::$NL.
                self::$NL.
                "<u>Log</u>" .self::$NL.
                $message
        );

        return $result;
    }

}
