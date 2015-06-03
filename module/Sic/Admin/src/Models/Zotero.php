<?php
namespace Sic\Admin\Models;

ini_set("display_errors", 1);

require_once(realpath(__DIR__."/../../../../../library/Httpful/httpful.phar"));

//header("Content-type:text/plain;charset=utf-8;");

use Sic\Admin\Models\Zotero\Document;
use Zend\Db\Sql\Predicate\Like;
use Zend\Db\Sql\Predicate\Between;
use Zend\Db\Sql\Predicate\Operator;
use Zend\Db\Sql\Predicate\PredicateSet;
use Zend\Db\Sql\Where;
use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;


class Zotero
{
    protected $user = null;

    protected $collection = null;

    protected $userAgent = null;

    protected $url = null;

    public function __construct($user=null, $collection=null){
        $this->setUser($user);
        $this->setCollection($collection);
        $this->setUserAgent($this->getRandomUserAgent());
    }

    public function setUser($user){ $this->user = $user; }

    public function setCollection($collection){ $this->collection = $collection; }

    public function setUserAgent($userAgent){ $this->userAgent = $userAgent; }

    public function setUrl($url){$this->url = $url;}

    public function createUrl($user, $collection){
        return "https://api.zotero.org/users/".$user."/collections/".$collection."/items";
    }

    protected function getRandomUserAgent()
    {
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
        return $userAgents[mt_rand(0, count($userAgents) - 1)];
    }

    protected function getUrl(){
        return $this->url;
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

    /**
     * @var Document
     */
    protected $document;

    protected function parse($response){
        $json = json_decode($response, true);
        $lastDocIdx = count($json) - 1;
        if($lastDocIdx > -1){
            $lastDoc = $json[$lastDocIdx];

            $this->document = new Document();

            $this->parseItemType($lastDoc);
            $this->parseCreators($lastDoc);
            $this->parseDate($lastDoc);
            $this->parseEdition($lastDoc);
            $this->parseExtra($lastDoc);
            $this->parseISBN($lastDoc);
            $this->parseNumPages($lastDoc);
            $this->parsePlace($lastDoc);
            $this->parsePublisher($lastDoc);
            $this->parseSeries($lastDoc);
            $this->parseSeriesNumber($lastDoc);


            $this->parseAccessDate($lastDoc);
            $this->parseEncyclopediaTitle($lastDoc);
            $this->parseISSN($lastDoc);
            $this->parseissue($lastDoc);
            $this->parseJournalAbbreviation($lastDoc);
            $this->parseSeriesText($lastDoc);
            $this->parseSeriesTitle($lastDoc);
            $this->parseMapType($lastDoc);
            $this->parseScale($lastDoc);
            $this->parseSection($lastDoc);
            $this->parseInstitution($lastDoc);
            $this->parseReportType($lastDoc);
            $this->parseReportNumber($lastDoc);
            $this->parseCode($lastDoc);
            $this->parseCodeNumber($lastDoc);
            $this->parseNameOfAct($lastDoc);
            $this->parsePublicLawNumber($lastDoc);
            $this->parseThesisType($lastDoc);
            $this->parseUniversity($lastDoc);
            $this->parseWebsiteTitle($lastDoc);
            $this->parseWebsiteType($lastDoc);


        }

    }


    protected function parseItemType($json){
        $note = $this->getByPath($json, "data/itemType");
        if($note){
            $this->document->addNote("itemType: ".$note);
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
        codes_pub_online
        1 - url
        2 - when
        3 - title
         */

        $creatorType = $this->getByPath($json, "creatorType");
        if($creatorType){
            $firstName = $this->getByPath($json, "firstName");
            $lastName = $this->getByPath($json, "lastName");
            $name = $this->getByPath($json, "name");

            switch($creatorType){
                case "author":
                    $code_id = 1;
                    $string = ($name ? $name : $lastName.", ".$firstName);
                    $this->document->addCreator($string, $code_id);
                    break;
                case "contributor":
                    $code_id = 1;
                    $string = ($name ? $name : $lastName.", ".$firstName);
                    $this->document->addCreator($string, $code_id);
                    break;
                case "editor":
                    $code_id = 3;
                    $string = ($name ? $name : $lastName.", ".$firstName);
                    $this->document->addCreator($string, $code_id);
                    break;
                case "seriesEditor":
                    $code_id = 1;
                    $string = ($name ? $name : $lastName.", ".$firstName);
                    $this->document->addCreator($string, $code_id);
                    break;
                case "translator":
                    $code_id = 6;
                    $string = ($name ? $name : $lastName.", ".$firstName);
                    $this->document->addCreator($string, $code_id);
                    break;
                case "bookAuthor":
                    $code_id = 3;
                    $string = ($name ? $name : $lastName.", ".$firstName);
                    $this->document->addSource($string, $code_id);
                    break;
                case "reviewedAuthor":
                    $string = ($name ? $name : $lastName.", ".$firstName);
                    $this->document->addTitle($string);
                    break;
                default:
                    $code_id = 5;
                    $string = ($name ? $name : $lastName.", ".$firstName);
                    $this->document->addCreator($string, $code_id);
                    break;
            }
        }
    }

    protected function parseDate($json){
        $str = $this->getByPath($json, "data/date");
        if($str){
            $this->document->addYear($str);
        }
    }

    protected function parseEdition($json){
        $str = $this->getByPath($json, "data/edition");
        if($str){
            $this->document->addEdition($str);
        }
    }

    protected function parseExtra($json){
        $str = $this->getByPath($json, "data/extra");
        if($str){
            $this->document->addNote("extra: ".$str);
        }
    }

    protected function parseISBN($json){
        $str = $this->getByPath($json, "data/ISBN");
        if($str){
            $this->document->addIdno($str, 3);
        }
    }

    protected function parseNumPages($json){
        $str = $this->getByPath($json, "data/numPages");
        if($str){
            $this->document->addPage($str);
        }
    }

    protected function parsePlace($json){
        $str = $this->getByPath($json, "data/place");
        if($str){
            $this->document->addPlace($str);
        }
    }

    protected function parsePublisher($json){
        $str = $this->getByPath($json, "data/publisher");
        if($str){
            $this->document->addPublisher($str);
        }
    }

    protected function parseSeries($json){
        $str = $this->getByPath($json, "data/series");
        if($str){
            $this->document->addSource($str, 4);
        }
    }

    protected function parseSeriesNumber($json){
        $str = $this->getByPath($json, "data/seriesNumber");
        if($str){
            $this->document->addSource($str, 4);
        }
    }

    protected function parseAccessDate($json){
        $str = $this->getByPath($json, "data/accessDate");
        if($str){
            $this->document->addOnline($str, 2);
        }
    }

    protected function parseEncyclopediaTitle($json){
        $str = $this->getByPath($json, "data/encyclopediaTitle");
        if($str){
            $this->document->addSource($str, 1);
        }
    }

    protected function parseISSN($json){
        $str = $this->getByPath($json, "data/ISSN");
        if($str){
            $this->document->addIdno($str, 3);
        }
    }

    protected function parseissue($json){
        $str = $this->getByPath($json, "data/issue");
        if($str){
            $this->document->addIssue($str);
        }
    }

    protected function parseJournalAbbreviation($json){
        $str = $this->getByPath($json, "data/journalAbbreviation");
        if($str){
            $this->document->addSource($str, 1);
        }
    }

    protected function parseSeriesText($json){
        $str = $this->getByPath($json, "data/seriesText");
        if($str){
            $this->document->addNote("seriesText: ".$str);
        }
    }

    protected function parseSeriesTitle($json){
        $str = $this->getByPath($json, "data/seriesTitle");
        if($str){
            $this->document->addSource($str, 4);
        }
    }

    protected function parseMapType($json){
        $str = $this->getByPath($json, "data/mapType");
        if($str){
            $this->document->addNote("mapType: ".$str);
        }
    }

    protected function parseScale($json){
        $str = $this->getByPath($json, "data/scale");
        if($str){
            $this->document->addSource($str, "scale: ".$str);
        }
    }

    protected function parseSection($json){
        $str = $this->getByPath($json, "data/section");
        if($str){
            $this->document->addSource($str, 1);
        }
    }

    protected function parseInstitution($json){
        $str = $this->getByPath($json, "data/institution");
        if($str){
            $this->document->addPublisher($str);
        }
    }

    protected function parseReportType($json){
        $str = $this->getByPath($json, "data/reportType");
        if($str){
            $this->document->addNote("reportType: ".$str);
        }
    }

    protected function parseReportNumber($json){
        $str = $this->getByPath($json, "data/reportNumber");
        if($str){
            $this->document->addIssue($str);
        }
    }

    protected function parseCode($json){
        $str = $this->getByPath($json, "data/code");
        if($str){
            $this->document->addTitle($str);
        }
    }

    protected function parseCodeNumber($json){
        $str = $this->getByPath($json, "data/codeNumber");
        if($str){
            $this->document->addVolume($str);
        }
    }

    protected function parseNameOfAct($json){
        $str = $this->getByPath($json, "data/nameOfAct");
        if($str){
            $this->document->addTitle($str);
        }
    }

    protected function parsePublicLawNumber($json){
        $str = $this->getByPath($json, "data/publicLawNumber");
        if($str){
            $this->document->addIssue($str);
        }
    }

    protected function parseThesisType($json){
        $str = $this->getByPath($json, "data/thesisType");
        if($str){
            $this->document->addNote("thesisType: ".$str);
        }
    }

    protected function parseUniversity($json){
        $str = $this->getByPath($json, "data/university");
        if($str){
            $this->document->addPublisher($str);
        }
    }

    protected function parseWebsiteTitle($json){
        $str = $this->getByPath($json, "data/websiteTitle");
        if($str){
            $this->document->addOnline($str, 3);
        }
    }

    protected function parseWebsiteType($json){
        $str = $this->getByPath($json, "data/websiteType");
        if($str){
            $this->document->addNote("websiteType: ".$str);
        }
    }


    public function toArray(){ return $this->document->toArray(); }

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