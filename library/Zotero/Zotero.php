<?php

/*
ini_set("display_errors", 1);

require_once(realpath(__DIR__."/../Httpful/httpful.phar"));

header("Content-type:text/plain;charset=utf-8;");

class Zotero
{
    protected $user = null;

    protected $collection = null;

    protected $userAgent = null;

    public function __construct($user=null, $collection=null){
        $this->setUser($user);
        $this->setCollection($collection);
        $this->setUserAgent($this->getRandomUserAgent());
    }

    public function setUser($user){ $this->user = $user; }

    public function setCollection($collection){ $this->collection = $collection; }

    public function setUserAgent($userAgent){ $this->userAgent = $userAgent; }

    protected function getRandomUserAgent(){
        $userAgents = array(
            'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:26.0) Gecko/20100101 Firefox/26.0',
            'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.107 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.36 (KHTML, like Gecko)',
            'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:26.0) Gecko/20100101 Firefox/26.0',
            'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)',
            'Mozilla/5.0 (Windows; U; MSIE 9.0; Windows NT 9.0; en-US)',
            'Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405'
        );
        return $userAgents[mt_rand(0, count($userAgents)-1)];
    }

    protected function getUrl(){
        return "https://api.zotero.org/users/".$this->user."/collections/".$this->collection."/items";
    }

    protected function getResponse(){
        $url = $this->getUrl();
        $response = \Httpful\Request::get($url)->addHeader('User-agent:', $this->userAgent)->send();
        return $response;
    }

    protected function getByPath($array, $path){
        $obj = $array;
        $e = explode("/", $path);
        for($c=0; $c<count($e); $c++){
            if(isset($obj[$e[$c]])){
                if($c == (count($e)-1)) {
                    return $obj[$e[$c]];
                }
                $obj = $obj[$e[$c]];
            }
        }
        return null;
    }


    public function run(){
        $response = $this->getResponse();
        $this->parse($response);


    }

    protected function parse($response){
        $json = json_decode($response, true);

        for($c=0; $c<count($json); $c++){
            $this->initTableVariable();
            $this->parseItemType($json[$c]);
            $this->parseCreators($json[$c]);
            $this->parseDate($json[$c]);
            $this->parseEdition($json[$c]);
            $this->parseExtra($json[$c]);
            $this->parseISBN($json[$c]);
            $this->parseNumPages($json[$c]);
            $this->parsePlace($json[$c]);
            $this->parsePublisher($json[$c]);
            $this->parseSeries($json[$c]);
            $this->parseSeriesNumber($json[$c]);

            $this->correctTables();
            var_dump($this->table);
        }
    }

    protected function parseItem($json){
        $this->parseItemType($json);
    }

    protected $table = null;

    protected function initTableVariable(){
        $this->table = array(
            "publication" => array(),
            "publication_note" => array(),
            "publication_creator" => array(),
            "publication_title" => array(),
            "publication_source" => array(),
            "publication_year" => array(),
            "publication_edition" => array(),
            "publication_idno" => array(),
            "publication_page" => array(),
            "publication_place" => array(),
            "publication_publisher" => array()
        );
    }

    protected function parseItemType($json){
        $note = $this->getByPath($json, "data/itemType");
        if($note){
            $this->addNote("itemType: ".$note);
        }
    }

    protected function parseCreators($json){
        $creators = $this->getByPath($json, "data/creators");
        if($creators){
            for($c=0; $c<count($creators); $c++){
                $this->parseCreator($creators[$c]);
            }
        }
    }

    protected function parseCreator($json){

        /*
        codes_pub_creator
        1 - author
        2 - addAuthor
        3 - editor
        4 - addEditor
        5 - organization
        6 - translator
         */

        /*
        codes_pub_source
        1 - title
        2 - editor
        3 - creator
        4 - series
        5 - collection
        6 - string
         */

        /*
        codes_pub_idno
        1 - cobiss
        2 - isbn
        3 - issn
        4 - doi
        5 - sistory
         */

/*
        $creatorType = $this->getByPath($json, "creatorType");
        if($creatorType){
            $firstName = $this->getByPath($json, "firstName");
            $lastName = $this->getByPath($json, "lastName");
            $name = $this->getByPath($json, "name");

            switch($creatorType){
                case "author":
                    $code_id = 1;
                    $string = ($name ? $name : $lastName.", ".$firstName);
                    $this->addCreator($string, $code_id);
                    break;
                case "contributor":
                    $code_id = 1;
                    $string = ($name ? $name : $lastName.", ".$firstName);
                    $this->addCreator($string, $code_id);
                    break;
                case "editor":
                    $code_id = 3;
                    $string = ($name ? $name : $lastName.", ".$firstName);
                    $this->addCreator($string, $code_id);
                    break;
                case "seriesEditor":
                    $code_id = 1;
                    $string = ($name ? $name : $lastName.", ".$firstName);
                    $this->addCreator($string, $code_id);
                    break;
                case "translator":
                    $code_id = 6;
                    $string = ($name ? $name : $lastName.", ".$firstName);
                    $this->addCreator($string, $code_id);
                    break;
                case "bookAuthor":
                    $code_id = 3;
                    $string = ($name ? $name : $lastName.", ".$firstName);
                    $this->addSource($string, $code_id);
                    break;
                case "reviewedAuthor":
                    $string = ($name ? $name : $lastName.", ".$firstName);
                    $this->addTitle($string);
                    break;
                default:
                    $code_id = 5;
                    $string = ($name ? $name : $lastName.", ".$firstName);
                    $this->addCreator($string, $code_id);
                    break;
            }
        }
    }

    protected function parseDate($json){
        $str = $this->getByPath($json, "data/date");
        if($str){
            $this->addYear($str);
        }
    }

    protected function parseEdition($json){
        $str = $this->getByPath($json, "data/edition");
        if($str){
            $this->addEdition($str);
        }
    }

    protected function parseExtra($json){
        $str = $this->getByPath($json, "data/extra");
        if($str){
            $this->addNote("extra: ".$str);
        }
    }

    protected function parseISBN($json){
        $str = $this->getByPath($json, "data/ISBN");
        if($str){
            $this->addIDNO($str, 3);
        }
    }

    protected function parseNumPages($json){
        $str = $this->getByPath($json, "data/numPages");
        if($str){
            $this->addPage($str);
        }
    }

    protected function parsePlace($json){
        $str = $this->getByPath($json, "data/place");
        if($str){
            $this->addPlace($str);
        }
    }

    protected function parsePublisher($json){
        $str = $this->getByPath($json, "data/publisher");
        if($str){
            $this->addPublisher($str);
        }
    }

    protected function parseSeries($json){
        $str = $this->getByPath($json, "data/series");
        if($str){
            $this->addSource($str, 4);
        }
    }

    protected function parseSeriesNumber($json){
        $str = $this->getByPath($json, "data/seriesNumber");
        if($str){
            $this->addSource($str, 4);
        }
    }

    /*
    protected function parseShortTitle($json){
        $str = $this->getByPath($json, "data/shortTitle");
        if($str){
            $this->addNote($str);
        }
    }

    protected function parseTitle($json){
        $str = $this->getByPath($json, "data/title");
        if($str){
            $this->addNote($str);
        }
    }

    protected function parseUrl($json){
        $str = $this->getByPath($json, "data/url");
        if($str){
            $this->addNote($str);
        }
    }

    protected function parseVolume($json){
        $str = $this->getByPath($json, "data/volume");
        if($str){
            $this->addNote($str);
        }
    }

    protected function parseBookTitle($json){
        $str = $this->getByPath($json, "data/bookTitle");
        if($str){
            $this->addNote($str);
        }
    }

    protected function parsePublicationTitle($json){
        $str = $this->getByPath($json, "data/publicationTitle");
        if($str){
            $this->addNote($str);
        }
    }

    protected function parseConferenceName($json){
        $str = $this->getByPath($json, "data/conferenceName");
        if($str){
            $this->addNote($str);
        }
    }

    protected function parseDOI($json){
        $str = $this->getByPath($json, "data/DOI");
        if($str){
            $this->addNote($str);
        }
    }

    protected function parseProceedingsTitle($json){
        $str = $this->getByPath($json, "data/proceedingsTitle");
        if($str){
            $this->addNote($str);
        }
    }

    protected function parseDictionaryTitle($json){
        $str = $this->getByPath($json, "data/dictionaryTitle");
        if($str){
            $this->addNote($str);
        }
    }
    */

/*
    protected function addPublication($parent_id=0, $original_id=0, $is_series=0){
        array_push($this->table["publication"], array("pub_id"=>null, "parent_id"=>$parent_id, "original_id"=>$original_id, "is_series"=>$is_series));
    }

    protected function addNote($note){
        array_push($this->table["publication_note"], array("pub_id"=>null, "idx"=>null, "note"=>$note));
    }

    protected function addCreator($creator, $code_id){
        array_push($this->table["publication_creator"], array("pub_id"=>null, "idx"=>null, "creator"=>$creator, "code_id"=>$code_id));
    }

    protected function addTitle($title){
        array_push($this->table["publication_title"], array("pub_id"=>null, "idx"=>null, "title"=>$title));
    }

    protected function addSource($source, $code_id){
        array_push($this->table["publication_source"], array("pub_id"=>null, "idx"=>null, "source"=>$source, "code_id"=>$code_id));
    }

    protected function addYear($year){
        array_push($this->table["publication_year"], array("pub_id"=>null, "idx"=>null, "year"=>$year));
    }

    protected function addEdition($edition){
        array_push($this->table["publication_edition"], array("pub_id"=>null, "idx"=>null, "edition"=>$edition));
    }

    protected function addIDNO($idno, $code_id){
        array_push($this->table["publication_idno"], array("pub_id"=>null, "idx"=>null, "idno"=>$idno, "code_id"=>$code_id));
    }

    protected function addPage($page){
        array_push($this->table["publication_page"], array("pub_id"=>null, "idx"=>null, "page"=>$page));
    }

    protected function addPlace($place){
        array_push($this->table["publication_place"], array("pub_id"=>null, "idx"=>null, "place"=>$place));
    }

    protected function addPublisher($publisher){
        array_push($this->table["publication_publisher"], array("pub_id"=>null, "idx"=>null, "publisher"=>$publisher));
    }


    protected function getPubId(){
        return \Sic\Admin\Models\DbUtil::selectOne("publication", new \Zend\Db\Sql\Expression("coalesce(max(pub_id)+1, 1)"));
    }

    protected function correctTables(){
        $pub_id = $this->getPubId();
        $tables = $this->table;
        foreach($tables as $table => $rows){
            if(substr($table, 0, strlen("publication_")) == "publication_"){
                for($c=0; $c<count($rows); $c++){
                    $this->table[$table][$c]["pub_id"] = $pub_id;
                    $this->table[$table][$c]["idx"] = $c+1;
                }
            }
        }
    }



    /*
itemType note
creators-creatorType="author" creator-author
creators-creatorType="contributor" creator-author
creators-creatorType="editor" creator-editor
creators-creatorType="seriesEditor" creator-editor
creators-creatorType="translator" creator-translator
creators-creatorType="*"-name creator-organization
creators-creatorType="bookAuthor" source-creator
creators-creatorType="reviewedAuthor" title
date date
edition edition
extra note

ISBN idno-isbn
numPages page
place pubPlace
publisher publisher
series source-series
seriesNumber source-series
shortTitle addTitle
title title
url online-url
volume volume
bookTitle source-title
publicationTitle source-title
conferenceName title
DOI idno-doi
proceedingsTitle source-title
dictionaryTitle source-title

accessDate online-when
encyclopediaTitle source-title
ISSN idno-issn
issue issue
journalAbbreviation source-title
seriesText note
seriesTitle source-series
mapType note
scale note
section source-title
institution publisher
reportType note
reportNumber issue
code title
codeNumber volume
nameOfAct title
publicLawNumber issue
thesisType note
university publisher
websiteTitle online-title
websiteType note
    */

/*
}
*/