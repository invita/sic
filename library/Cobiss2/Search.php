<?php
namespace Cobiss;

use Httpful\Request;

class Search
{
    private $search;

    private $userAgent;

    private $response;

    private $hiddenInputs;

    // name = srtsel
    private $sortSelect;

    public function __construct($search)
    {
        $this->search = $search;
        $this->userAgent = new UserAgent();
        $this->response = $this->search();

        $this->parse();

        header("Content-type:text/plain");
        var_dump($this->response->body);

        return $this;
    }

    private function search()
    {
        $uri = 'http://www.cobiss.si/scripts/cobiss';
        $payload = "base=99999&command=SEARCH&srch=".$this->search;
        $response = Request::post($uri, $payload)->addHeader('User-agent:', $this->userAgent)->send();

        return $response;
    }

    private function parse()
    {
        $html = str_get_html($this->response->body);

        header("Content-type:text/plain");

        $this->hiddenInputs = array();
        foreach($html->find("form.#dirform input[type=hidden]") as $input)
        {
            array_push($this->hiddenInputs, array("name"=>$input->name, "value"=>$input->value));
        }

        $this->sortSelect = array();
        foreach($html->find("form.#dirform select.#sortl option") as $option)
        {
            array_push($this->sortSelect, array("html"=>$option->innertext, "value"=>$option->value));
        }





        //var_dump($this->sortSelect);


        //die();

        //$form = $html->find("form.#dirform");


        //header("Content-type:text/plain");
        //var_dump($form);
    }

}