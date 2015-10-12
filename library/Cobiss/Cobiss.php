<?php
ini_set("display_errors", 1);

require_once(realpath(__DIR__."/../Httpful/httpful.phar"));
require_once(realpath(__DIR__."/../Ganon/ganon.php"));

header("Content-type:text/plain;charset=utf-8;");


class Cobiss_Search_Window
{
    /**
     * @var string
     */
    private $userAgent;

    /**
     * @return string
     */
    public function getUserAgent(){ return $this->userAgent; }

    /**
     * @param string $userAgent
     */
    public function setUserAgent($userAgent) { $this->userAgent = $userAgent; }

    /**
     * @var \Httpful\Request
     */
    private $lastResponse;

    /**
     * @return \Httpful\Response
     */
    public function getLastResponse(){ return $this->lastResponse; }

    /**
     * @param \Httpful\Response $response
     */
    public function setLastResponse(Httpful\Response $response){ $this->lastResponse = $response; }

    /**
     * @var Cobiss_Form
     */
    private $form;

    /**
     * @return Cobiss_Form
     */
    public function getForm(){ return $this->form; }

    /**
     * @param Cobiss_Form $form
     */
    public function setForm(Cobiss_Form $form){ $this->form = $form; }

    /**
     * @var Cobiss_Paginator
     */
    private $paginator;

    /**
     * @return Cobiss_Paginator
     */
    public function getPaginator(){ return $this->paginator; }

    /**
     * @param Cobiss_Paginator $paginator
     */
    public function setPaginator(Cobiss_Paginator $paginator){ $this->paginator = $paginator; }

    /**
     * @var Cobiss_DataTable
     */
    private $dataTable;

    /**
     * @return Cobiss_DataTable
     */
    public function getDataTable(){ return $this->dataTable; }

    /**
     * @param Cobiss_DataTable $dataTable
     */
    public function setDataTable(Cobiss_DataTable $dataTable) { $this->dataTable = $dataTable; }

    public function __construct(){
        $this->userAgent = $this->getRandomUserAgent();
    }

    /**
     * @param string $search
     * @return bool
     */
    public function search($search){
        $uri = 'http://www.cobiss.si/scripts/cobiss';
        $payload = "base=99999&command=SEARCH&srch=".$search;
        $response = Httpful\Request::post($uri, $payload)->addHeader('User-agent:', $this->userAgent)->send();
        $this->setLastResponse($response);
        return $this->parseResponse();
    }

    /**
     * @param string $url
     * @return bool
     */
    public function loadFromUrl($url, $data=array()){
        if($data){
            $payload = "";

            $response = \Httpful\Request::post($url, $payload)->addHeader('User-agent:', $this->userAgent)->send();
        } else {
            $response = \Httpful\Request::get($url)->addHeader('User-agent:', $this->userAgent)->send();
        }
        $this->setLastResponse($response);
        return $this->parseResponse();
    }

    /**
     * @return array
     */
    public function toArray(){
        $array = array();
        $array["userAgent"] = $this->getUserAgent();
        $array["form"] = $this->getForm()->toArray();
        $array["paginator"] = $this->getPaginator()->toArray();
        $array["dataTable"] = $this->getDataTable()->toArray();
        return $array;
    }

    /**
     * @return string
     */
    public function toJSON(){
        return json_encode($this->toArray());
    }

    /**
     * @return string
     */
    private function getRandomUserAgent(){
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

    /**
     * @return bool
     */
    private function parseResponse(){
        $dom = str_get_dom($this->lastResponse->body);
        $formNode = $dom("form#dirform", 0);
        if(!$formNode) return false;
        $this->parseForm($formNode);
        $this->parsePaginator($formNode);
        $this->parseDataTable($formNode);
        return true;
    }

    /**
     * @param HTML_Node $formNode
     */
    private function parseForm(HTML_Node $formNode){
        $action = $formNode->getAttribute('action');
        $form = new Cobiss_Form($action);
        $inputNames = array("ctrlh", "ukaz", "ID", "chng", "chnum", "sid");
        for($i=0; $i<count($inputNames); $i++){
            $name = $inputNames[$i];
            $inputNode = $formNode("input[name=".$name."]", 0);
            $value = $inputNode->getAttribute("value");
            $input = new Cobiss_Form_Input($name, $value);
            $form->addInput($input);
        }
        $selectNames = array("sortl", "perpg");
        for($i=0; $i<count($selectNames); $i++){
            $id = $selectNames[$i];
            $selectNode = $formNode("select#".$id, 0);
            $name = $selectNode->getAttribute("name");
            $select = new Cobiss_Form_Select($name);
            foreach($selectNode("option") as $optionNode){
                $value = $optionNode->getAttribute("value");
                $selected = $optionNode->getAttribute("selected");
                $text = $optionNode->getInnerText();
                $option = new Cobiss_Form_Select_Option($value, $text);
                if($selected) $option->setSelected(true);
                $select->addOption($option);
            }
            $form->addSelect($select);
        }
        $this->setForm($form);
    }

    /**
     * @param HTML_Node $formNode
     */
    private function parsePaginator(HTML_Node $formNode){
        $paginatorNode = $formNode("ol#paginator", 0);
        $paginator = new Cobiss_Paginator();
        foreach($paginatorNode("li") as $liNode){
            $liId = $liNode->getAttribute("id");
            $liClass = $liNode->getAttribute("class");
            $countA = count($liNode("a"));
            $url = null;
            $url2 = null;
            $value2 = null;
            $insertSecondPage = false;
            $secondPageFirst = false;
            if($liClass == "first"){
                if( $liId == "red" ){
                    if($countA == 0){
                        $value = $liNode->getInnerText();
                    } else if($countA == 1){
                        $aNode = $liNode("a", 0);
                        $value = trim($liNode->getPlainText());
                        preg_match_all('/\d+/', $value, $matches);
                        $value = $matches[0][0];
                        $value2 = "...";
                        $url2 = $aNode->getAttribute("href");
                        $insertSecondPage = true;
                        $secondPageFirst = true;
                    }
                } else {
                    if($countA == 1){
                        $aNode = $liNode("a", 0);
                        $url = $aNode->getAttribute("href");
                        $value = $aNode->getInnerText();
                    } else if($countA == 2){
                        $aNode = $liNode("a", 1);
                        $url = $aNode->getAttribute("href");
                        $value = $aNode->getInnerText();
                        $aNode2 = $liNode("a", 0);
                        $url2 = $aNode2->getAttribute("href");
                        $value2 = $aNode2->getInnerText();
                        $insertSecondPage = true;
                        $secondPageFirst = true;
                    }
                }
            } else if($liClass == "last"){
                if( $liId == "red" ){
                    if($countA == 0){
                        $value = $liNode->getInnerText();
                    } else if($countA == 1){
                        $aNode = $liNode("a", 0);
                        $value = trim($liNode->getPlainText());
                        preg_match_all('/\d+/', $value, $matches);
                        $value = $matches[0][0];
                        $value2 = "...";
                        $url2 = $aNode->getAttribute("href");
                        $insertSecondPage = true;
                    }
                } else {
                    if($countA == 1){
                        $aNode = $liNode("a", 0);
                        $url = $aNode->getAttribute("href");
                        $value = $aNode->getInnerText();
                    } else if($countA == 2){
                        $aNode = $liNode("a", 0);
                        $url = $aNode->getAttribute("href");
                        $value = $aNode->getInnerText();
                        $aNode2 = $liNode("a", 1);
                        $url2 = $aNode2->getAttribute("href");
                        $value2 = $aNode2->getInnerText();
                        $insertSecondPage = true;
                    }
                }
            } else {
                if( $liId == "red" ){
                    $value = $liNode->getInnerText();
                } else {
                    $aNode = $liNode("a", 0);
                    $url = $aNode->getAttribute("href");
                    $value = $aNode->getInnerText();
                }
            }

            if($insertSecondPage && $url2 && $value2 && $secondPageFirst){
                $page = new Cobiss_Paginator_Page($value2, $url2);
                $paginator->addPage($page);
                $url2 = null;
                $value2 = null;
                $insertSecondPage = false;
                $secondPageFirst = false;
            }

            $page = new Cobiss_Paginator_Page($value, $url);
            $paginator->addPage($page);

            if($insertSecondPage && $url2 && $value2 && !$secondPageFirst){
                $page = new Cobiss_Paginator_Page($value2, $url2);
                $paginator->addPage($page);
                $url2 = null;
                $value2 = null;
                $insertSecondPage = false;
                $secondPageFirst = false;
            }
        }
        $this->setPaginator($paginator);
    }

    /**
     * @param HTML_Node $formNode
     */
    private function parseDataTable(HTML_Node $formNode){
        $dataTable = new Cobiss_DataTable();
        $tbodyNode = $formNode("table#nolist-full tbody", 0);
        foreach($tbodyNode("tr") as $trNode){
            $tdNodeNumberNode = $trNode("td", 1);
            $tdNodeAuthorNode = $trNode("td", 3);
            $tdNodeTitleNode = $trNode("td", 4);
            $tdNodeLanguageNode = $trNode("td", 6);
            $tdNodeYearNode = $trNode("td", 7);
            $value = trim($tdNodeNumberNode->getPlainText());
            preg_match_all('/\d+/', $value, $matches);
            $number = $matches[0][0];
            $author = $tdNodeAuthorNode->getPlainText();
            $aNode = $tdNodeTitleNode("a", 0);
            if($aNode){
                $title = $aNode->getPlainText();
                $url = $aNode->getAttribute("href");
            } else {
                $title = $tdNodeTitleNode->getPlainText();
                $url = null;
            }
            $language = $tdNodeLanguageNode->getPlainText();
            $year = $tdNodeYearNode->getPlainText();

            $row = new Cobiss_DataTable_Row();
            $row->setNumber($number);
            $row->setAuthor($author);
            $row->setTitle($title);
            $row->setUrl($url);
            $row->setLanguage($language);
            $row->setYear($year);

            $dataTable->addRow($row);
        }
        $this->setDataTable($dataTable);
    }
}

class Cobiss_Detail_Window{

    /**
     * @var string
     */
    private $userAgent;

    /**
     * @return string
     */
    public function getUserAgent(){ return $this->userAgent; }

    /**
     * @param string $userAgent
     */
    public function setUserAgent($userAgent) { $this->userAgent = $userAgent; }

    /**
     * @var \Httpful\Request
     */
    private $lastResponse;

    /**
     * @return \Httpful\Response
     */
    public function getLastResponse(){ return $this->lastResponse; }

    /**
     * @param \Httpful\Response $response
     */
    public function setLastResponse(Httpful\Response $response){ $this->lastResponse = $response; }

    public function __construct(){
        $this->userAgent = $this->getRandomUserAgent();
    }

    /**
     * @param string $url
     * @return bool
     */
    public function loadFromUrl($url){
        $response = \Httpful\Request::get($url)->addHeader('User-agent:', $this->userAgent)->send();
        $this->setLastResponse($response);
        return $this->parseResponse();
    }

    /**
     * @return string
     */
    public function getRandomUserAgent(){
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

    /**
     * @var Cobiss_Detail_Data
     */
    private $data;

    /**
     * @param Cobiss_Detail_Data $data
     */
    public function setData(Cobiss_Detail_Data $data){ $this->data = $data; }

    public function getData(){return $this->data;}

    /**
     * @return bool
     */
    private function parseResponse(){
        $dom = str_get_dom($this->lastResponse->body);
        $tableNode = $dom("table#nolist-full tbody", 0);
        if(!$tableNode) return false;
        $detailData = new Cobiss_Detail_Data();
        foreach($tableNode("tr") as $trNode){
            $thNode = $trNode("th", 0);
            if($thNode && $thNode->getInnerText() == "Avtor"){
                foreach($trNode("td a") as $aNode){
                    $author = trim(str_replace(",", "", $aNode->getInnerText()));
                    $detailData->addAuthor($author);
                }
            } else if($thNode && $thNode->getInnerText() == "Naslov"){
                $tdNode = $trNode("td", 0);
                $titles = $tdNode->getInnerText();
                $array = explode("/", $titles);
                for($a=0; $a<count($array); $a++){
                    $title = trim($array[$a]);
                    $detailData->addTitle($title);
                }
            } else if($thNode && $thNode->getInnerText() == "Založništvo in izdelava"){
                $tdNode = $trNode("td", 0);
                $publisher = trim($tdNode->getInnerText());
                $detailData->setPublisher($publisher);
            } else if($thNode && $thNode->getInnerText() == "COBISS.SI-ID"){
                $tdNode = $trNode("td", 0);
                $cobissId = trim($tdNode->getInnerText());
                $detailData->setCobissId($cobissId);
            }
        }
        $this->setData($detailData);
        return true;
    }

    /**
     * @return array
     */
    public function toArray(){
        $array = array();
        $array["data"] = $this->getData()->toArray();
        return $array;
    }
}

class Cobiss_Form
{
    /**
     * @var string
     */
    private $method = "POST";

    /**
     * @var string
     */
    private $action = "";

    /**
     * @return string
     */
    public function getAction(){ return $this->action; }

    /**
     * @param $action
     */
    public function setAction($action){ $this->action = $action; }

    /**
     * @var Cobiss_Form_Input[]
     */
    private $inputArray = array();

    /**
     * @return Cobiss_Form_Input[]
     */
    public function getInputArray(){ return $this->inputArray; }

    /**
     * @param Cobiss_Form_Input $input
     */
    public function addInput(Cobiss_Form_Input $input){ array_push($this->inputArray, $input); }

    /**
     * @var Cobiss_Form_Select[]
     */
    private $selectArray = array();

    /**
     * @return Cobiss_Form_Select[]
     */
    public function getSelectArray(){ return $this->selectArray; }

    /**
     * @param Cobiss_Form_Select $select
     */
    public function addSelect(Cobiss_Form_Select $select){ array_push($this->selectArray, $select); }

    /**
     * @param string $action
     */
    public function __construct($action){
        $this->setAction($action);
    }

    /**
     * @return array
     */
    public function toArray(){
        $array = array();
        $array["inputArray"] = array();
        $array["selectArray"] = array();
        $array["selectArrayOptions"] = array();

        $inputArray = $this->getInputArray();
        $selectArray = $this->getSelectArray();

        for($c=0; $c<count($inputArray); $c++){
            array_push($array["inputArray"], array($inputArray[$c]->getName() => $inputArray[$c]->getValue()));
        }

        for($c=0; $c<count($selectArray); $c++){
            array_push($array["selectArray"], array($selectArray[$c]->getName() => $selectArray[$c]->getValue()));
            $selectName = $selectArray[$c]->getName();
            $options = $selectArray[$c]->getOptions();
            $array["selectArrayOptions"][$selectName] = array();
            for($i=0; $i<count($options); $i++){
                array_push($array["selectArrayOptions"][$selectName], array($options[$i]->getText() => $options[$i]->getValue()));
            }
        }

        return $array;
    }
}

class Cobiss_Form_Input
{
    /**
     * @var string
     */
    private $name;

    /**
     * @return string
     */
    public function getName(){ return $this->name; }

    /**
     * @param string $name
     */
    public function setName($name){ $this->name = $name; }

    /**
     * @var string
     */
    private $value;

    /**
     * @return string
     */
    public function getValue(){ return $this->value; }

    /**
     * @param string $value
     */
    public function setValue($value){ $this->value = $value; }

    /**
     * @param string $name
     * @param string $value
     */
    public function __construct($name, $value){
        $this->setName($name);
        $this->setValue($value);
    }

}

class Cobiss_Form_Select
{
    /**
     * @var string
     */
    private $name;

    /**
     * @return string
     */
    public function getName(){ return $this->name; }

    /**
     * @param string $name
     */
    public function setName($name){ $this->name = $name; }

    /**
     * @var Cobiss_Form_Select_Option[]
     */
    private $option = array();

    /**
     * @param Cobiss_Form_Select_Option $option
     */
    public function addOption(Cobiss_Form_Select_Option $option){ array_push($this->option, $option); }

    /**
     * @return Cobiss_Form_Select_Option[]
     */
    public function getOptions(){ return $this->option; }

    /**
     * @return string
     */
    public function getValue(){
        $options = $this->getOptions();
        for($c=0; $c<count($options); $c++){
            $option = $options[$c];
            if($option->getSelected()) return $option->getValue();
        }
    }

    /**
     * @param string $name
     */
    public function __construct($name){
        $this->setName($name);
    }
}

class Cobiss_Form_Select_Option
{
    /**
     * @var string
     */
    private $value;

    /**
     * @return string
     */
    public function getValue(){ return $this->value; }

    /**
     * @param string $value
     */
    public function setValue($value){ $this->value = $value; }

    /**
     * @var bool
     */
    private $selected = false;

    /**
     * @return bool
     */
    public function getSelected(){ return $this->selected; }

    /**
     * @param bool $selected
     */
    public function setSelected($selected){ $this->selected = $selected; }

    /**
     * @var string
     */
    private $text;

    /**
     * @return string
     */
    public function getText(){ return $this->text; }

    /**
     * @param string $text
     */
    public function setText($text){ $this->text = $text; }

    /**
     * @param string $value
     * @param string $text
     */
    public function __construct($value, $text){
        $this->setValue($value);
        $this->setText($text);
    }
}

class Cobiss_Paginator
{
    /**
     * @var Cobiss_Paginator_Page[]
     */
    private $pages = array();

    /**
     * @return Cobiss_Paginator_Page[]
     */
    public function getPages(){ return $this->pages; }

    /**
     * @param Cobiss_Paginator_Page $page
     */
    public function addPage(Cobiss_Paginator_Page $page){ array_push($this->pages, $page); }

    /**
     * @return array
     */
    public function toArray(){
        $array = array();
        $array["pages"] = array();
        foreach($this->getPages() as $page){
            array_push($array["pages"], $page->toArray());
        }
        return $array;
    }
}

class Cobiss_Paginator_Page
{
    /**
     * @var int|string
     */
    private $value;

    /**
     * @return int|string
     */
    public function getValue(){ return $this->value; }

    /**
     * @param int|string $value
     */
    public function setValue($value){ $this->value = $value; }

    /**
     * @var string|null
     */
    private $url;

    /**
     * @return string|null
     */
    public function getUrl(){ return $this->url; }

    /**
     * @param string|null $url
     */
    public function setUrl($url){ $this->url = $url; }

    /**
     * @param string $value
     * @param string|null $url
     */
    public function __construct($value, $url){
        $this->setValue($value);
        $this->setUrl($url);
    }

    /**
     * @return array
     */
    public function toArray(){
        $array = array();
        $array["value"] = $this->getValue();
        $array["url"] = $this->getUrl();
        return $array;
    }
}

class Cobiss_DataTable
{
    /**
     * @var Cobiss_DataTable_Row[]
     */
    private $rows = array();

    /**
     * @return Cobiss_DataTable_Row[]
     */
    public function getRows(){ return $this->rows; }

    /**
     * @param Cobiss_DataTable_Row $row
     */
    public function addRow(Cobiss_DataTable_Row $row){ array_push($this->rows, $row); }

    /**
     * @return array
     */
    public function toArray(){
        $array = array();
        $array["rows"] = array();
        foreach($this->getRows() as $row){
            array_push($array["rows"], $row->toArray());
        }
        return $array;
    }
}

class Cobiss_DataTable_Row
{
    /**
     * @var int
     */
    private $number;

    /**
     * @return int
     */
    public function getNumber(){ return $this->number; }

    /**
     * @param int $number
     */
    public function setNumber($number){ $this->number = $number; }

    /**
     * @var string
     */
    private $author;

    /**
     * @return string
     */
    public function getAuthor(){ return $this->author; }

    /**
     * @param string $author
     */
    public function setAuthor($author){ $this->author = $author; }

    /**
     * @var string
     */
    private $title;

    /**
     * @return string
     */
    public function getTitle(){ return $this->title; }

    /**
     * @param string $title
     */
    public function setTitle($title){ $this->title = $title; }

    /**
     * @var string
     */
    private $url;

    /**
     * @return string
     */
    public function getUrl(){ return $this->url; }

    /**
     * @param string $url
     */
    public function setUrl($url){ $this->url = $url; }

    /**
     * @var string
     */
    private $language;

    /**
     * @return string
     */
    public function getLanguage(){ return $this->language; }

    /**
     * @param string $language
     */
    public function setLanguage($language){ $this->language = $language; }

    /**
     * @var int
     */
    private $year;

    /**
     * @return int
     */
    public function getYear(){ return $this->year; }

    /**
     * @param int $year
     */
    public function setYear($year){ $this->year = $year; }

    /**
     * @return array
     */
    public function toArray(){
        $array = array();
        $array["number"] = $this->getNumber();
        $array["author"] = $this->getAuthor();
        $array["title"] = $this->getTitle();
        $array["url"] = $this->getUrl();
        $array["language"] = $this->getLanguage();
        $array["year"] = $this->getYear();
        return $array;
    }
}

class Cobiss_Data
{
    private $data = array();
    public function setDataRow($key, $value){ $this->data[$key] = $value; }
}

class Cobiss_Detail_Data {

    private $authors = array();
    private $titles = array();
    private $year;
    private $cobissId;
    private $publisher;

    public function addAuthor($author){ array_push($this->authors, $author); }
    public function addTitle($title){ array_push($this->titles, $title); }
    public function setYear($year){ $this->year = $year; }
    public function setCobissId($cobissId){ $this->cobissId = $cobissId; }
    public function setPublisher($publisher){ $this->publisher = $publisher; }

    public function getAuthors(){ return $this->authors; }
    public function getTitles(){ return $this->titles; }
    public function getYear(){ return $this->year; }
    public function getCobissId(){ return $this->cobissId; }
    public function getPublisher(){ return $this->publisher; }

    public function toArray(){
        $array = array();
        $array["authors"] = $this->getAuthors();
        $array["titles"] = $this->getTitles();
        $array["year"] = $this->getYear();
        $array["cobissId"] = $this->getCobissId();
        $array["publisher"] = $this->getPublisher();
        return $array;
    }

}