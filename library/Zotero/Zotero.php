<?php
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

        var_dump($this->table);
    }

    protected function parse($response){
        $json = json_decode($response, true);

        for($c=0; $c<count($json); $c++){
            $this->initTableVariable();
            $this->parseItemType($json[$c]);
        }
    }

    protected function parseItem($json){
        $this->parseItemType($json);
    }

    protected $table = null;

    protected function initTableVariable(){
        $this->table = array(
            "publication_note" => array(),
            "publication_creator" => array()
        );
    }

    protected function parseItemType($json){
        $note = $this->getByPath($json, "data/itemType");
        if($note){
            $this->addPublicationNote("itemType: ".$note);
        }
    }

    protected function parseCreators($json){
        $creators = $this->getByPath($json, "data/creators");
        if($creators){
            for($c=0; $c<count($creators); $c++){
                $this->parseCreator($json[$c]);
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

        $creatorType = $this->getByPath($json, "creatorType");
        if($creatorType){
            $firstName = $this->getByPath($json, "firstName");
            $lastName = $this->getByPath($json, "lastName");

            switch($creatorType){
                case "author":
                    $code_id = 1;
                    break;
                case "contributor":
                    $code_id = 1;
                    break;
                case "editor":
                    $code_id = 3;
                    break;
                case "seriesEditor":
                    $code_id = 1;
                    break;
                case "translator":
                    $code_id = 6;
                    break;
                case "bookAuthor":

                    break;
                case "reviewedAuthor":

                    break;
                default:
                    $code_id = 5;
                    break;
            }
        }
    }

    protected function addPublicationNote($note){
        array_push($this->table["publication_note"], array("pub_id"=>null, "idx"=>null, "note"=>$note));
    }

    protected function addCreator($creator, $code_id){
        array_push($this->table["publication_note"], array("pub_id"=>null, "idx"=>null, "creator"=>$creator, "code_id"=>$code_id));
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


}