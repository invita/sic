<?php

ini_set("display_errors", 1);

require_once(realpath(__DIR__."/../Httpful/httpful.phar"));

class Solr {

    protected $queryString = null;

    protected $userAgent = null;

    protected $data = null;

    public function __construct(){
        $this->setUserAgent($this->getRandomUserAgent());
    }

    public function setQueryString($queryString){ $this->queryString = $queryString; }

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
        $url = "http://sic.invita.si:8983/solr/select".$this->queryString;
        //$url = urlencode($url);
        $url = str_replace("\\\"", "%22", $url);
        $url = str_replace(" ", "%20", $url);
        //echo $url."\n";
        return $url;
    }

    protected function getResponse(){
        $url = $this->getUrl();
        $response = \Httpful\Request::get($url)->addHeader('User-agent:', $this->userAgent)->send();
        return $response;
    }

    protected function parse($response){
        $json = json_decode($response->body, true);
        $this->data = $json["response"]["docs"];
    }

    public function run(){
        $response = $this->getResponse();
        $this->parse($response);
    }

    public function toArray(){ return $this->data; }
}